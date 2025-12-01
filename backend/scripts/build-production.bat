@echo off
echo Building Telugu E-Paper for Production...
echo.

echo Installing dependencies...
call npm install

echo Building frontend...
call npm run build

echo.
echo Production build complete!
echo.
echo Next steps:
echo 1. Push to GitHub
echo 2. Deploy to Vercel
echo 3. Update environment variables
echo.
pause