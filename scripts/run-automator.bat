@echo off
title Gmail JD Automator Runner
color 0B
echo ========================================================
echo        Gmail JD Automator - Local Runner
echo ========================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "AUTOMATOR_DIR=%SCRIPT_DIR%..\automation\gmail-jd-automator"

cd /d "%AUTOMATOR_DIR%"

echo [*] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in your PATH.
    echo Please install Python 3.9+ from https://www.python.org/
    pause
    exit /b 1
)

if not exist "venv" (
    echo [*] Creating Python virtual environment in venv...
    python -m venv venv
)

echo [*] Activating virtual environment...
call venv\Scripts\activate.bat

echo [*] Checking dependencies...
pip install -r requirements.txt --quiet

if not exist ".env" (
    if exist ".env.example" (
        echo [!] .env file not found. Copying .env.example...
        copy .env.example .env
        echo [*] Please configure your ANTHROPIC_API_KEY and RESUME_PATH in:
        echo     %AUTOMATOR_DIR%\.env
    )
)

if not exist "credentials\credentials.json" (
    echo.
    echo [!] WARNING: Google OAuth credentials.json not found in:
    echo     %AUTOMATOR_DIR%\credentials\credentials.json
    echo.
    echo Please download your OAuth client JSON from Google Cloud Console:
    echo 1. Go to https://console.cloud.google.com/
    echo 2. Enable Gmail API
    echo 3. Create OAuth Client ID (Desktop Application)
    echo 4. Save JSON as credentials\credentials.json
    echo.
)

echo [*] Starting Gmail JD Automator...
echo.
python main.py

echo.
echo ========================================================
echo Automator run finished.
echo Press any key to exit.
pause > nul
