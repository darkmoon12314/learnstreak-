@echo off
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
    echo Node.js is required to run this app.
    echo Install Node.js from https://nodejs.org/ and try again.
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo npm is required to run this app.
    echo Install Node.js from https://nodejs.org/ and try again.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Installing project dependencies...
    npm install
    if errorlevel 1 (
        echo Dependency installation failed.
        pause
        exit /b 1
    )
)

node "%~dp0desktop-launcher.cjs"
