# Clear Authentication Script
# Run this in your browser console to clear all authentication data

Write-Host "🧹 Clearing all authentication data..." -ForegroundColor Yellow

# Instructions to manually clear localStorage
Write-Host ""
Write-Host "MANUAL STEPS to clear authentication:" -ForegroundColor Cyan
Write-Host "1. Open your browser (http://localhost:8080)"
Write-Host "2. Press F12 to open Developer Tools"
Write-Host "3. Go to Console tab"
Write-Host "4. Paste this command and press Enter:"
Write-Host ""
Write-Host "localStorage.removeItem('staffUser'); localStorage.removeItem('sessionTimestamp'); localStorage.removeItem('staffLoginAttempts'); location.reload();" -ForegroundColor Green
Write-Host ""
Write-Host "5. Or click 'Clear Auth' button on the debug panel at bottom-right"
Write-Host ""
Write-Host "After clearing, test the secret access methods:" -ForegroundColor Yellow
Write-Host "- Secret URL: http://localhost:8080/log-org"
Write-Host "- Keyboard: Ctrl + Alt + A"
Write-Host "- Logo: Triple-click the header logo"
Write-Host ""
Write-Host "All should redirect to /staff-login and require authentication!" -ForegroundColor Green
