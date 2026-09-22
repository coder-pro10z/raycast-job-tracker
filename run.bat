@echo off
title NextApply Job Tracker Launcher
color 0A
echo ========================================================
echo        NextApply Job Tracker - Local Launcher
echo ========================================================
echo.

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo [1/3] Starting .NET 9 Backend API (http://localhost:5089)...
start "NextApply Backend (Port 5089)" cmd /k "cd /d "%SCRIPT_DIR%backend\NextApply.Api" && dotnet run --urls "http://localhost:5089""

echo [2/3] Starting React Vite Frontend (http://localhost:5173)...
start "NextApply Frontend (Port 5173)" cmd /k "cd /d "%SCRIPT_DIR%frontend" && npm run dev"

echo.
echo [3/3] Waiting for servers to initialize...
timeout /t 4 /nobreak > nul

echo.
echo [*] Launching NextApply in your default browser...
start http://localhost:5173/

echo.
echo ========================================================
echo   Services are running!
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://localhost:5089
echo   - API Key / Passphrase: dev-local-key
echo ========================================================
echo.
echo To stop services later, run stop.bat or close the windows.
echo Press any key to close this launcher window.
pause > nul
