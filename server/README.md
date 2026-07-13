# CivicTrack Backend Setup

This backend serves the CivicTrack civic issue reporting application using Express.js and MongoDB.

## Prerequisites

- Node.js (v14+)
- MongoDB (locally installed or Atlas connection string)

## Installation

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your MongoDB connection string:
   ```
   MONGO_URI=mongodb://localhost:27017/civictrack
   PORT=5000
   ```

## Running the Backend

### Development (with auto-reload):
```bash
npm run dev
```

### Production:
```bash
npm start
```

The backend will start on `http://localhost:5000`

## MongoDB Setup

### Local MongoDB:
1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   - **Windows:** `mongod`
   - **Mac/Linux:** `brew services start mongodb-community`

### MongoDB Atlas (Cloud):
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get your connection string
3. Update `MONGO_URI` in `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/civictrack
   ```

## Using MongoDB Compass

1. Download MongoDB Compass from https://www.mongodb.com/products/compass
2. Connect using your MongoDB URI
3. You'll see:
   - **Database:** `civictrack`
   - **Collections:** 
     - `issues` - Contains all reported civic issues
     - Notifications are stored in-memory for now

## API Endpoints

### Issues
- `GET /api/issues` - Get all issues
- `GET /api/issues/:id` - Get issue by ID
- `POST /api/issues` - Create new issue (supports file upload)
- `PATCH /api/issues/:id/status` - Update issue status. Can include multipart `image` field when marking resolved; the file will be stored as `resolutionImage` on the issue.
- `PATCH /api/issues/:id/assign` - Assign issue to a department (admin only)
- `POST /api/auth/signup` - Register new user (body: {name,email,password,role})
- `POST /api/auth/login` - Authenticate user, returns JWT token

Ensure `Authorization: Bearer <token>` header is sent for protected routes.

### Notifications
- `GET /api/notifications` - Get all notifications

## Frontend Integration

The frontend is configured to proxy API calls to this backend via Vite. When both servers are running:
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:5000`

The frontend will automatically route `/api/*` requests to the backend.

## Project Structure

```
server/
├── index.js           # Main server file
├── models/
│   └── Issue.js       # MongoDB Issue schema
├── uploads/           # Uploaded issue images
├── package.json       # Dependencies
├── .env.example       # Environment template
└── .env               # Your local configuration (git-ignored)
```
