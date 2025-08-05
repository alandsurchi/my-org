# 🚀 Deployment Guide: Charity Dashboard

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ Backend API fully tested and working locally
- ✅ Frontend components updated and tested
- ✅ Content uploaded through demo interface
- ✅ Branding and customization completed
- ✅ All environment variables documented

## 🔧 Backend Deployment

### Option 1: Railway (Recommended)

**Why Railway?**
- Simple deployment process
- Automatic HTTPS
- Built-in monitoring
- PostgreSQL/MongoDB support

**Steps:**
1. **Create Railway Account**: https://railway.app
2. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```
3. **Login**: `railway login`
4. **Initialize Project**:
   ```bash
   cd backend
   railway init
   ```
5. **Add Environment Variables**:
   ```bash
   railway variables set MONGODB_URI="mongodb+srv://REMOVED"
   railway variables set JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   railway variables set PORT=5000
   ```
6. **Deploy**: `railway up`

### Option 2: Heroku

**Steps:**
1. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli
2. **Create App**:
   ```bash
   heroku create your-charity-dashboard-api
   ```
3. **Set Environment Variables**:
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://REMOVED"
   heroku config:set JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```
4. **Create Procfile**:
   ```
   web: node index.js
   ```
5. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Option 3: DigitalOcean App Platform

**Steps:**
1. **Create DigitalOcean Account**: https://www.digitalocean.com/
2. **Go to App Platform**: Create new app
3. **Connect GitHub Repository**
4. **Configure Build Settings**:
   - Build Command: `npm install`
   - Run Command: `node index.js`
5. **Add Environment Variables** in the dashboard
6. **Deploy**

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Optimized for React/Next.js
- Automatic deployments from Git
- Global CDN
- Easy environment variable management

**Steps:**
1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```
2. **Login**: `vercel login`
3. **Deploy from Project Directory**:
   ```bash
   cd c:\Users\aland\Desktop\test-2\my-org
   vercel
   ```
4. **Follow Prompts**:
   - Link to existing project? No
   - Project name: `your-charity-dashboard`
   - Directory: `./` (current)
   - Override settings? No

5. **Set Environment Variables** (if needed):
   ```bash
   vercel env add VITE_API_URL production
   # Enter your backend URL: https://your-api-domain.com
   ```

### Option 2: Netlify

**Steps:**
1. **Build the Project**:
   ```bash
   npm run build
   ```
2. **Create Netlify Account**: https://www.netlify.com/
3. **Drag and Drop `dist` folder** to Netlify dashboard
4. **Or Connect GitHub**:
   - Link repository
   - Build command: `npm run build`
   - Publish directory: `dist`

### Option 3: GitHub Pages

**Steps:**
1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```
2. **Update package.json**:
   ```json
   {
     "homepage": "https://yourusername.github.io/your-charity-dashboard",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```
3. **Deploy**:
   ```bash
   npm run deploy
   ```

## 🔄 Environment Variables Setup

### Backend Environment Variables
```env
# Production Backend (.env)
MONGODB_URI=mongodb+srv://REMOVED
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend Environment Variables
```env
# Production Frontend (.env.production)
VITE_API_URL=https://your-backend-domain.com
VITE_APP_NAME=Your Charity Name
```

## 🔐 Security Checklist

Before going live:

### Backend Security
- [ ] Change JWT_SECRET to a strong, random string
- [ ] Configure CORS to only allow your frontend domain
- [ ] Set up rate limiting
- [ ] Enable HTTPS only
- [ ] Validate all inputs
- [ ] Set up proper error handling (don't expose internal errors)

### Database Security
- [ ] MongoDB connection uses SSL
- [ ] Database user has minimal required permissions
- [ ] Regular backups configured
- [ ] Monitor for unusual activity

### Frontend Security
- [ ] No sensitive data in client-side code
- [ ] HTTPS enforced
- [ ] Content Security Policy configured
- [ ] Regular dependency updates

## 📊 Post-Deployment Checklist

### Testing
- [ ] API endpoints respond correctly
- [ ] File uploads work
- [ ] Authentication works
- [ ] All pages load without errors
- [ ] Mobile responsiveness works
- [ ] Images display correctly

### Performance
- [ ] Page load times under 3 seconds
- [ ] Images optimized
- [ ] API response times acceptable
- [ ] CDN configured for static assets

### Monitoring
- [ ] Error tracking set up (e.g., Sentry)
- [ ] Analytics configured (e.g., Google Analytics)
- [ ] Uptime monitoring (e.g., UptimeRobot)
- [ ] Database monitoring

## 🆘 Troubleshooting

### Common Deployment Issues

**Backend Won't Start:**
```bash
# Check logs
railway logs  # for Railway
heroku logs --tail  # for Heroku
```

**Database Connection Failed:**
- Verify MongoDB URI is correct
- Check if IP whitelist includes 0.0.0.0/0 for cloud deployments
- Ensure database user has correct permissions

**Frontend Build Fails:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**CORS Errors:**
- Update backend CORS configuration with production frontend URL
- Ensure API URL in frontend environment variables is correct

### Emergency Rollback
```bash
# Railway
railway rollback

# Heroku
heroku rollback

# Vercel
vercel --prod  # deploy previous version
```

## 🎉 Going Live!

Once deployed:

1. **Test Everything**: Go through all functionality on production
2. **Update Documentation**: Record all URLs and credentials
3. **Set Up Monitoring**: Ensure you get notified of issues
4. **Plan Updates**: Set up CI/CD for future updates
5. **Backup Strategy**: Ensure regular backups are working

## 📞 Support Resources

- **Railway Support**: https://railway.app/help
- **Vercel Documentation**: https://vercel.com/docs
- **MongoDB Atlas Support**: https://support.mongodb.com/
- **React Deployment**: https://create-react-app.dev/docs/deployment/

Your charity dashboard is now ready for the world! 🌍✨
