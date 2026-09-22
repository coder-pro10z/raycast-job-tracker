@echo off
title Push NextApply to GitHub
color 0B
echo =======================================================
echo     Pushing NextApply Updates to GitHub for Vercel
echo =======================================================
echo.
cd /d "%~dp0"
echo Current Git Status:
git status
echo.
echo Pushing commits to GitHub (origin main)...
git push origin main
echo.
if %ERRORLEVEL% equ 0 (
    color 0A
    echo =======================================================
    echo   [SUCCESS] Pushed commits to GitHub successfully!
    echo   Vercel will now automatically rebuild and update:
    echo   https://raycast-job-tracker.vercel.app/
    echo =======================================================
) else (
    color 0C
    echo =======================================================
    echo   [PUSH FAILED] Check the error message above.
    echo   If GitHub authentication is needed, sign in via
    echo   the browser prompt or GitHub Personal Access Token.
    echo =======================================================
)
echo.
pause
