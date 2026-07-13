@echo off
echo Starting YOLO service...
cd yolo-service
start /B python app.py
timeout /t 3 /nobreak > nul

echo Starting backend...
cd ../server
start /B npx nodemon index.js
timeout /t 2 /nobreak > nul

echo Starting frontend...
cd ..
start /B npm run dev

echo All services started!
echo YOLO: http://localhost:5001
echo Backend: http://localhost:5000
echo Frontend: http://localhost:8081
echo.
echo Press any key to exit...
pause > nul