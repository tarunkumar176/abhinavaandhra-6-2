@echo off
echo Starting Telugu E-Paper Development Environment...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Development Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul