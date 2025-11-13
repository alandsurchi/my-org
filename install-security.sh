#!/bin/bash

# Install Security Dependencies for Staff Login System

echo "🔒 Installing security dependencies for staff login system..."

# Navigate to backend directory
cd backend

# Install express-rate-limit for login protection
echo "📦 Installing express-rate-limit..."
npm install express-rate-limit@^7.1.5

# Navigate back to frontend
cd ..

echo "✅ Security dependencies installed successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Update your .env.local file with secret staff path"
echo "2. Restart your backend server"
echo "3. Test the secret login at: http://localhost:8080/log-org"
echo ""
echo "🔑 Staff Login Credentials:"
echo "   Email: aland.surchi456@gmail.com"
echo "   Password: Aa11don.,"
echo ""
echo "🚨 SECURITY NOTICE:"
echo "   - Change default credentials in production"
echo "   - Configure HTTPS for production deployment"
echo "   - Review STAFF_SECURITY_GUIDE.md for complete setup"
