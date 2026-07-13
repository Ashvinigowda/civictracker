# Quick Start Guide

This is a complete civic issue reporting platform with frontend, backend, and AI-powered YOLO image classification.

## Setup Instructions

### 1. MongoDB Setup (Choose One)

**Option A: Local MongoDB**
- Download and install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service:
  - Windows: Run `mongod` in Command Prompt
  - Mac/Linux: Run `brew services start mongodb-community`
- Update `server/.env`:
  ```env
  MONGO_URI=mongodb://localhost:27017/civictrack
  PORT=5000
  JWT_SECRET=your-secret-key-here
  ```

**Option B: MongoDB Atlas (Cloud - Recommended)**
- Go to https://www.mongodb.com/cloud/atlas and create free account
- Create a cluster and get connection string
- Update `server/.env`:
  ```env
  MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/civictrack
  PORT=5000
  JWT_SECRET=your-secret-key-here
  ```

### 2. Install MongoDB Compass (Optional but Recommended)
- Download from https://www.mongodb.com/products/compass
- Connect using your `MONGO_URI` to browse/manage data

### 3. Python Setup for YOLO Service
```bash
# Install Python dependencies for YOLO
cd yolo-service
pip install -r requirements.txt
```

### 4. Start All Services
**Windows:**
```cmd
start-all.bat
```

**Linux/Mac:**
```bash
chmod +x start-all.sh
./start-all.sh
```

Or start individually:

**Terminal 1 - YOLO Service:**
```bash
cd yolo-service
python app.py
```
Runs on http://localhost:5001

**Terminal 2 - Backend Server:**
```bash
cd server
npx nodemon index.js
```
Backend will run on http://localhost:5000

**Terminal 3 - Frontend:**
```bash
npm run dev
```
Frontend will run on http://localhost:8080

### 5. Access the Application
- **Main Site:** http://localhost:8080
- **Report Issue:** http://localhost:8080/report
- **YOLO API:** http://localhost:5001/classify

## AI Features

The app now includes AI-powered image classification using YOLO:

- **Automatic Issue Classification**: When users upload images, YOLO automatically detects and classifies the issue type
- **Supported Categories**: Pothole, Garbage, Water Leak, Streetlight Damage
- **Fallback**: If AI can't classify, defaults to "Other"

## API Endpoints

### Issues
- `POST /api/issues` - Create new issue (with optional auto-classification)
- `GET /api/issues` - Get all issues
- `GET /api/issues/:id` - Get specific issue
- `PATCH /api/issues/:id/status` - Update issue status

### YOLO Service
- `POST /classify` - Classify uploaded image
- `GET /health` - Health check
- **Track Complaint:** http://localhost:8080/track
- **Admin Dashboard:** http://localhost:8080/admin
- **API Docs:** http://localhost:5000/api/*

## Features

✅ **Report Issues** - Citizens can report civic problems with photos  
✅ **Track Complaints** - Search complaint by ID to check status  
✅ **Admin Dashboard** - Manage all complaints and update status  
✅ **Real-time Notifications** - Get notified of complaint updates  
✅ **Image Upload** - Attach photos when reporting issues  
✅ **Issue Types** - Pothole, Garbage, Water Leak, Streetlight Damage, Other  
✅ **Status Tracking** - Reported → Assigned → In Progress → Resolved  

## Issue Types & Status

**Issue Types:**
- Pothole
- Garbage
- Water Leak
- Streetlight Damage
- Other

**Status Flow:**
- Reported (initial)
- Assigned (to a team)
- In Progress (being fixed)
- Resolved (completed)

## Backend API

All requests go through the proxy at `http://localhost:8080/api/...`

```bash
# Get all issues
GET /api/issues

# Get specific issue by MongoDB ID
GET /api/issues/[ObjectId]

# Create new issue
POST /api/issues (form-data with file upload)

# Update issue status
PATCH /api/issues/[ObjectId]/status

### Authentication

- `POST /api/auth/signup` - create a new user {name,email,password,role}
- `POST /api/auth/login` - login with credentials, returns token

### Authorization

- `PATCH /api/issues/[ObjectId]/assign` - assign an issue to a department (admin only, requires Bearer token)

# Get notifications
GET /api/notifications
```

## Troubleshooting

**MongoDB Connection Error?**
- Ensure MongoDB is running (check MongoDB Compass connection)
- Verify `MONGO_URI` is correct in `server/.env`
- If using Atlas, check IP whitelist and username/password

**Frontend can't reach backend?**
- Ensure backend is running on port 5000
- Check Vite proxy settings in `vite.config.ts`

**Port already in use?**
- Backend: Change `PORT` in `server/.env`
- Frontend: Change port in `vite.config.ts` server.port

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- React Router
- Lucide Icons

**Backend:**
- Express.js
- MongoDB + Mongoose
- Multer (file uploads)
- CORS
- Node.js

## Project Structure

```
civictrack-ai/
├── src/                    # Frontend code
│   ├── pages/             # React pages
│   ├── components/        # Reusable components
│   ├── lib/              # Utilities (api.ts)
│   └── data/             # Mock data
├── server/               # Backend Express app
│   ├── models/          # MongoDB schemas
│   ├── uploads/         # Uploaded images
│   ├── index.js         # Main server file
│   └── package.json
├── public/              # Static assets
└── vite.config.ts       # Frontend build config
```

## Next Steps

1. Set up MongoDB (local or Atlas)
2. Install and run backend: `cd server && npm install && npm run dev`
3. Install and run frontend: `npm install && npm run dev`
4. Visit http://localhost:8080 and start reporting issues!
5. Use Admin Dashboard at http://localhost:8080/admin to manage complaints

Enjoy CivicTrack! 🎉
