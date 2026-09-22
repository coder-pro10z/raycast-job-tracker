@echo off
title Stop NextApply
color 0C
echo ========================================================
echo        Stopping NextApply Backend & Frontend
echo ========================================================
echo.

echo [*] Stopping processes on port 5089 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5089 ^| findstr LISTENING 2^>nul') do (
    taskkill /F /PID %%a 2>nul
)

echo [*] Stopping processes on port 5173 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING 2^>nul') do (
    taskkill /F /PID %%a 2>nul
)

echo.
echo [OK] NextApply local services stopped successfully.
timeout /t 3 > nul
