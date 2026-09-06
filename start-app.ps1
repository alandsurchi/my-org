# Local development launcher.
# Requires backend/.env (copy backend/.env.example) and .env (copy .env.example).
# No secrets live in this file.

$root = $PSScriptRoot

if (-not (Test-Path "$root\backend\.env")) {
    Write-Host "backend\.env is missing. Copy backend\.env.example and fill in DATABASE_URL and JWT_SECRET." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path "$root\.env")) {
    Write-Host ".env is missing. Copy .env.example (VITE_API_URL=http://localhost:5000/api for a local backend)." -ForegroundColor Red
    exit 1
}

Write-Host "Starting backend (http://localhost:5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @("-NoExit", "-Command", "cd '$root\backend'; npm run dev")

Start-Sleep -Seconds 3

Write-Host "Starting frontend (http://localhost:8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @("-NoExit", "-Command", "cd '$root'; npm run dev")

Start-Sleep -Seconds 5
Start-Process "http://localhost:8080"
Write-Host "Frontend: http://localhost:8080   Dashboard: http://localhost:8080/staff-login   API: http://localhost:5000" -ForegroundColor Cyan
