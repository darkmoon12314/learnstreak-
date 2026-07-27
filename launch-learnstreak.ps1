Set-Location $PSScriptRoot

$npmPath = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmPath) {
    Write-Host "Node.js and npm are required to run this app."
    Write-Host "Install Node.js from https://nodejs.org/ and try again."
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing project dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Dependency installation failed."
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host "Starting the app in background preview mode..."
Start-Process powershell -ArgumentList @(
    "-NoProfile",
    "-Command",
    "Set-Location '$PSScriptRoot'; npm run start:online"
)

Start-Process "http://localhost:4173"
