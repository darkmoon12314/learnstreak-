@echo off
setlocal
cd /d "%~dp0"

rem Create app directories if missing
if not exist "web_app" mkdir "web_app"
if not exist "mobile_app" mkdir "mobile_app"

rem Move essential web app files into web_app if not already there
for %%F in (package.json package-lock.json yarn.lock pnpm-lock.yaml tsconfig.json tsconfig.node.json vite.config.js webpack.config.js .env .env.local .env.example .browserslistrc postcss.config.js tailwind.config.js babel.config.js) do (
    if exist "%%~F" if not exist "web_app\%%~F" move /Y "%%~F" "web_app\" >nul 2>&1
)
for %%D in (public src node_modules) do (
    if exist "%%~D" if not exist "web_app\%%~D" move /Y "%%~D" "web_app\" >nul 2>&1
)

set "WEB_ROOT=%~dp0web_app"
set "HOST=127.0.0.1"
set "PORT=3000"
set "URL=http://%HOST%:%PORT%"

cd /d "%WEB_ROOT%"

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
    echo Installing dependencies in web_app...
    call npm install
    if errorlevel 1 (
        echo Dependency installation failed.
        pause
        exit /b 1
    )
)

echo Starting LearnStreak at %URL%...
start "LearnStreak Server" cmd /k cd /d "%WEB_ROOT%" ^&^& npm run dev -- --host %HOST% --port %PORT%

timeout /t 8 /nobreak >nul
start "" "%URL%"

echo Opened %URL% in your browser.
echo Press Ctrl+C in the server window to stop it.
endlocal
