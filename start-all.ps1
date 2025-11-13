# Start All Servers Script for MROVDOSTAN
# This script starts both backend and frontend servers

Write-Host "🚀 Starting MROVDOSTAN Application..." -ForegroundColor Cyan
Write-Host ""

# Check if backend directory exists
if (-Not (Test-Path ".\backend")) {
    Write-Host "❌ Error: Backend directory not found!" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Step 1: Starting Backend Server (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host '🔧 Backend Server' -ForegroundColor Green; npm start"

Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Gray
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "📦 Step 2: Starting Frontend Server (Port 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host '⚛️ Frontend Server' -ForegroundColor Blue; npm run dev -- --port 8080"

Write-Host "⏳ Waiting for frontend to start..." -ForegroundColor Gray
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your application will be available at:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:8080" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "   Status:   http://localhost:8080/status.html" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Keep the server windows open. Close them to stop the servers." -ForegroundColor Gray
Write-Host ""

# Wait a moment then try to open the browser
Start-Sleep -Seconds 5
Write-Host "🌐 Opening browser..." -ForegroundColor Cyan
Start-Process "http://localhost:8080"

Write-Host ""
Write-Host "✨ Setup complete! Press any key to exit this window..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
