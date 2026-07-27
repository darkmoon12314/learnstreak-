@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
    echo Node.js was not found. Install Node.js from https://nodejs.org/ and try again.
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo npm was not found. Install Node.js from https://nodejs.org/ and try again.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Dependency installation failed.
        pause
        exit /b 1
    )
)

set "HOST=127.0.0.1"
set "PORT=3000"
set "URL=http://%HOST%:%PORT%"

echo Starting LearnStreak at %URL%...
start "LearnStreak Server" cmd /k cd /d "%~dp0" ^&^& npm run dev -- --host %HOST% --port %PORT%

timeout /t 8 /nobreak >nul
start "" "%URL%"

echo Opened %URL% in your browser.
echo Press Ctrl+C in the server window to stop it.
endlocal
