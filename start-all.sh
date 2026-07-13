#!/bin/bash
# Start YOLO service
echo "Starting YOLO service..."
cd yolo-service
python app.py &
YOLO_PID=$!

# Wait a moment for YOLO to start
sleep 3

# Start backend
echo "Starting backend..."
cd ../server
npx nodemon index.js &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo "All services started!"
echo "YOLO: http://localhost:5001"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:8081"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap "echo 'Stopping services...'; kill $YOLO_PID $BACKEND_PID $FRONTEND_PID; exit" INT
wait