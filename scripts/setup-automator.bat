@echo off
title NextApply - 1-Click Automator Setup
color 0A
echo ========================================================
echo       NextApply Automator - 1-Click Machine Setup
echo ========================================================
echo.
echo This script will automatically verify and install all
echo dependencies for the Gmail JD Automator on Windows.
echo.

set "SCRIPT_DIR=%~dp0"
set "AUTOMATOR_DIR=%SCRIPT_DIR%..\automation\gmail-jd-automator"

:: 1. Check Python
echo [1/4] Checking Python 3.9+ installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo [!] Python is not installed. Installing Python 3.12 via Windows Package Manager (winget)...
    winget install -e --id Python.Python.3.12 --accept-package-agreements --accept-source-agreements
    if errorlevel 1 (
        echo [WARNING] winget failed. Please install Python manually from https://www.python.org/
    ) else (
        echo [OK] Python installed successfully. Please restart this script if PATH has not refreshed.
    )
) else (
    echo [OK] Python is already installed:
    python --version
)
echo.

:: 2. Check Tesseract OCR (Optional with Claude Vision fallback)
echo [2/4] Checking Tesseract OCR installation...
where tesseract >nul 2>&1
if errorlevel 1 (
    if exist "C:\Program Files\Tesseract-OCR\tesseract.exe" (
        echo [OK] Tesseract found at C:\Program Files\Tesseract-OCR\tesseract.exe
        set "PATH=%PATH%;C:\Program Files\Tesseract-OCR"
    ) else (
        echo [!] Tesseract OCR not found.
        echo Attempting 1-click install via winget (UB-Mannheim.TesseractOCR)...
        winget install -e --id UB-Mannheim.TesseractOCR --accept-package-agreements --accept-source-agreements
        if errorlevel 1 (
            echo [NOTE] Tesseract installation skipped. Don't worry! The Automator now includes
            echo        automatic Claude Vision fallback so it will parse JD screenshots directly
            echo        using Claude without needing tesseract.exe!
        ) else (
            echo [OK] Tesseract OCR installed successfully.
        )
    )
) else (
    echo [OK] Tesseract OCR found in PATH.
)
echo.

:: 3. Setup Python venv and requirements
echo [3/4] Setting up Python virtual environment and dependencies...
cd /d "%AUTOMATOR_DIR%"
if not exist "venv" (
    echo [*] Creating virtualenv at %AUTOMATOR_DIR%\venv...
    python -m venv venv
)
echo [*] Activating venv and installing packages...
call venv\Scripts\activate.bat
python -m pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet
echo [OK] Python packages installed successfully.
echo.

:: 4. Check configuration files
echo [4/4] Verifying configuration files...
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [OK] Created .env from template.
    )
) else (
    echo [OK] .env file exists.
)

if not exist "credentials" mkdir credentials
if not exist "credentials\credentials.json" (
    echo [!] Missing credentials\credentials.json - please add your Google OAuth client secret.
) else (
    echo [OK] Google OAuth credentials.json detected.
)
echo.

echo ========================================================
echo   [SUCCESS] Setup completed!
echo   Run scripts\run-automator.bat whenever you want to process JDs.
echo ========================================================
echo.
pause
