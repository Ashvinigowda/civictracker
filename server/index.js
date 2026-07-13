require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const Issue = require('./models/Issue');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// simple in‑memory notification store

// auth helpers
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}
let notifications = [];
function addNotification(message) {
  const entry = {
    id: Date.now(),
    message,
    time: new Date().toISOString(),
    read: false,
  };
  notifications.unshift(entry);
  // keep a reasonable length
  if (notifications.length > 50) notifications.pop();
}

// middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// YOLO classification helper
async function classifyDescriptionWithAI(description) {
  try {
    const response = await axios.post('http://localhost:5001/classify', 
      { description },
      { timeout: 10000 }
    );

    console.log('✅ AI Classification Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ AI classification error:', error.message);
    return { issue_type: 'Other', confidence: 0, error: error.message };
  }
}

// Transform MongoDB document to frontend format
function transformIssue(doc) {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    type: doc.type,
    description: doc.description,
    location: doc.location,
    lat: doc.lat || 0,
    lng: doc.lng || 0,
    date: doc.date ? doc.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    status: doc.status,
    assignedTo: doc.assignedTo,
    image: doc.image,
    resolutionImage: doc.resolutionImage,
  };
}

// routes
app.get('/api/notifications', (req, res) => {
  res.json(notifications);
});

// auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const user = new User({ name, email, password, role });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(400).json({ error: err.message || 'Signup failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// public endpoint; optionally show all or filter by assigned role if query provided
app.get('/api/issues', async (req, res) => {
  try {
    const role = req.query.role;
    let query = {};
    if (role) query.assignedTo = role;
    const issues = await Issue.find(query).sort({ createdAt: -1 });
    res.json(issues.map(transformIssue));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

app.get('/api/issues/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    res.json(transformIssue(issue));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch issue' });
  }
});

// file upload setup
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

app.post('/api/issues', upload.single('image'), async (req, res) => {
  try {
    const { type, description, location, lat, lng, autoClassify } = req.body;
    let issueData = { type, description, location };

    if (lat) issueData.lat = parseFloat(lat);
    if (lng) issueData.lng = parseFloat(lng);

    if (req.file) {
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      issueData.image = imageUrl;

      // Auto-classify issue description via AI if requested and no type provided
      if (autoClassify === 'true' && (!type || type === 'Other')) {
        const classification = await classifyDescriptionWithAI(description);

        if (classification.issue_type && classification.issue_type !== 'Other') {
          issueData.type = classification.issue_type;
          console.log(`AI classified description as: ${classification.issue_type} (confidence: ${classification.confidence})`);
        }
      }
    }

    console.log('Creating issue with data:', issueData);
    const issue = new Issue(issueData);
    await issue.save();
    addNotification(`New complaint #${issue._id} has been registered successfully`);
    res.status(201).json(transformIssue(issue));
  } catch (err) {
    console.error('❌ Error creating issue:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to create issue', details: err.message });
  }
});

app.patch('/api/issues/:id/status', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    // allow only admin or assigned department to update status
    if (req.user.role !== 'ADMIN' && issue.assignedTo !== req.user.role) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    issue.status = status;
    // if an image file (resolution photo) is uploaded, attach URL
    if (req.file) {
      issue.resolutionImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    await issue.save();
    addNotification(`Complaint #${issue._id} status updated to "${status}"`);
    res.json(transformIssue(issue));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});


// assignment endpoint (admin only)
app.patch('/api/issues/:id/assign', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const { role } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    issue.assignedTo = role;
    issue.status = 'Assigned';
    await issue.save();
    addNotification(`Complaint #${issue._id} assigned to ${role}`);
    res.json(transformIssue(issue));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to assign issue' });
  }
});

// connect to Mongo and start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
      console.log(`MongoDB connected: ${mongoose.connection.readyState === 1 ? 'Yes' : 'No'}`);
      console.log(`YOLO Service expected at: http://localhost:5001`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Test text classification endpoint
app.post('/api/classify-text', async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({ error: 'No description provided' });
    }

    console.log('🧪 Testing text classification...');
    const classification = await classifyDescriptionWithAI(description);

    res.json(classification);
  } catch (err) {
    console.error('Text classification error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Test YOLO classification endpoint (deprecated - use /api/classify-text instead)
app.post('/api/test-classify', upload.single('image'), async (req, res) => {
  try {
    if (!req.body.description) {
      return res.status(400).json({ error: 'No description provided' });
    }

    console.log('🧪 Testing description classification...');
    const classification = await classifyDescriptionWithAI(req.body.description);

    res.json({
      classification: classification
    });
  } catch (err) {
    console.error('Test classification error:', err);
    res.status(500).json({ error: err.message });
  }
});
