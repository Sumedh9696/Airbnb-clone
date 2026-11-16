@echo off
TITLE Airbnb Clone Full Stack Launcher
echo ========================================================
echo       Launching Airbnb Clone Full Stack Application      
echo ========================================================
echo.

:: Check backend node_modules
if not exist "%~dp0backend\node_modules" (
    echo [Setup] Installing backend dependencies...
    cd /d "%~dp0backend"
    call npm install
)

:: Check frontend node_modules
if not exist "%~dp0frontend\node_modules" (
    echo [Setup] Installing frontend dependencies...
    cd /d "%~dp0frontend"
    call npm install
)

echo Starting Backend API on http://localhost:5000 ...
start "Airbnb Backend (Port 5000)" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend on http://localhost:5173 ...
start "Airbnb Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo  Both services launched!
echo  Open in browser: http://localhost:5173
echo  Backend API:    http://localhost:5000/api
echo ========================================================
timeout /t 5 >nul
exit
