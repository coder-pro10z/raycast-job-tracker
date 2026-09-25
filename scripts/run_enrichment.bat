@echo off
title NextApply - Opportunity & JD Enrichment Engine
color 0B
echo ========================================================
echo   NextApply - Opportunity & JD Autonomous Enrichment
echo   Candidate: Praveen Kashyap (3+ YoE, Full Stack / SDE)
echo ========================================================
echo.

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%.."

echo [*] Checking Python environment...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in your PATH.
    pause
    exit /b 1
)

echo [*] Running Autonomous Opportunity Enrichment Engine...
if "%~1"=="" (
    python scripts\enrich_opportunities.py --pilot-15
) else (
    python scripts\enrich_opportunities.py %*
)

echo.
echo ========================================================
echo   Enrichment run finished.
echo   Master_Job_Tracker_Verified.xlsx and public sheet updated!
echo ========================================================
echo.
pause
