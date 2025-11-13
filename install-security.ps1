# Install Security Dependencies for Staff Login System

Write-Host "🔒 Installing security dependencies for staff login system..." -ForegroundColor Green

# Navigate to backend directory
Set-Location backend

# Install express-rate-limit for login protection
Write-Host "📦 Installing express-rate-limit..." -ForegroundColor Yellow
npm install express-rate-limit@^7.1.5

# Navigate back to frontend
Set-Location ..

Write-Host "✅ Security dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update your .env.local file with secret staff path"
Write-Host "2. Restart your backend server"
Write-Host "3. Test the secret login at: http://localhost:8080/log-org"
Write-Host ""
Write-Host "🔑 Staff Login Credentials:" -ForegroundColor Yellow
Write-Host "   Email: aland.surchi456@gmail.com"
Write-Host "   Password: Aa11don.,"
Write-Host ""
Write-Host "🚨 SECURITY NOTICE:" -ForegroundColor Red
Write-Host "   - Change default credentials in production"
Write-Host "   - Configure HTTPS for production deployment"  
Write-Host "   - Review STAFF_SECURITY_GUIDE.md for complete setup"
