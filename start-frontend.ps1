# Frontend Development Server Startup Script
# Run this script to start your React application

Write-Host "🚀 Starting Charity Dashboard Frontend..." -ForegroundColor Green

# Set execution policy for current session
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force

# Navigate to project directory
$projectPath = "c:\Users\aland\Desktop\test-2\my-org"
Set-Location $projectPath

Write-Host "📁 Current directory: $(Get-Location)" -ForegroundColor Yellow

# Check if package.json exists
if (Test-Path "package.json") {
    Write-Host "✅ package.json found" -ForegroundColor Green
} else {
    Write-Host "❌ package.json not found!" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules found" -ForegroundColor Green
} else {
    Write-Host "⚠️ node_modules not found, installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Try different methods to start the dev server
Write-Host "🔄 Attempting to start development server..." -ForegroundColor Blue

# Method 1: npm run dev
Write-Host "Method 1: npm run dev" -ForegroundColor Cyan
try {
    & npm run dev
} catch {
    Write-Host "❌ Method 1 failed" -ForegroundColor Red
    
    # Method 2: npx vite
    Write-Host "Method 2: npx vite" -ForegroundColor Cyan
    try {
        & npx vite
    } catch {
        Write-Host "❌ Method 2 failed" -ForegroundColor Red
        
        # Method 3: Direct vite execution
        Write-Host "Method 3: Direct vite execution" -ForegroundColor Cyan
        try {
            & ".\node_modules\.bin\vite.cmd"
        } catch {
            Write-Host "❌ All methods failed. Please check the troubleshooting guide." -ForegroundColor Red
            Write-Host "📖 Check NEXT_STEPS_GUIDE.md for solutions" -ForegroundColor Yellow
        }
    }
}

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
