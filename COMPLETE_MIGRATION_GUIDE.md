# 🚀 Complete Migration Guide: Lovable + Supabase → Vite + Express + MongoDB

## 📖 Overview

This guide will help you completely migrate your organization website from:
- **FROM**: Lovable (frontend) + Supabase (backend/database)
- **TO**: Vite + React (frontend) + Express + MongoDB (backend/database)

**Estimated Time**: 4-6 hours
**Difficulty**: Intermediate
**Backup Required**: Yes (Critical)

---

## 🔧 Phase 1: Preparation & Setup

### 1.1 Prerequisites Check

Ensure you have the following installed:
```bash
node --version  # Should be v18 or higher
npm --version   # Should be v8 or higher
git --version   # Any recent version
```

Install MongoDB:
- **Local**: [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
- **Cloud**: Set up [MongoDB Atlas](https://www.mongodb.com/atlas)

### 1.2 Backup Current State

```bash
# Create backup directory
mkdir -p migration-backup/original-code

# Backup current source code
cp -r src migration-backup/original-code/
cp package.json migration-backup/original-code/
cp vite.config.ts migration-backup/original-code/
cp -r supabase migration-backup/original-code/

# Commit current state to git
git add .
git commit -m "Pre-migration backup"
git tag pre-migration-backup
```

### 1.3 Export Supabase Data

```bash
# Make the export script executable and run it
chmod +x scripts/export-supabase-data.js
node scripts/export-supabase-data.js
```

**Verify**: Check that `migration-backup/supabase-data/` contains all your data files.

---

## 🔧 Phase 2: Backend Setup

### 2.1 Initialize Backend Project

```bash
# Create backend directory
mkdir backend
cd backend

# Copy package.json
cp ../backend/package.json ./

# Install dependencies
npm install

# Create directory structure
mkdir -p src/{models,routes,middleware,utils}
```

### 2.2 Setup Environment Variables

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
# Update MongoDB connection string, JWT secret, etc.
```

**Required Environment Variables:**
```env
MONGODB_URI=mongodb://localhost:27017/org_website
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here
ADMIN_EMAIL=aland.surchi456@gmail.com
ADMIN_PASSWORD=Aa11don.,
```

### 2.3 Copy Backend Source Files

```bash
# Copy all backend source files
cp -r ../backend/src/* ./src/

# Build the project
npm run build
```

### 2.4 Start MongoDB and Test Backend

```bash
# Start MongoDB (if running locally)
mongod

# In another terminal, start the backend
npm run dev

# Test health endpoint
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 1.234
}
```

---

## 🔧 Phase 3: Data Migration

### 3.1 Run Data Migration Script

```bash
# From backend directory
npm run build
node dist/utils/migrateData.js
```

### 3.2 Verify Data Migration

```bash
# Connect to MongoDB
mongosh

# Switch to your database
use org_website

# Check collections and record counts
show collections
db.news.countDocuments()
db.projects.countDocuments()
db.staff.countDocuments()
db.gallery.countDocuments()

# Exit MongoDB shell
exit
```

**Verify**: Compare record counts with your Supabase export data.

---

## 🔧 Phase 4: Frontend Migration

### 4.1 Remove Old Dependencies

```bash
# From frontend root directory
cd ..  # Back to frontend root

# Remove Supabase and Lovable dependencies
npm uninstall @supabase/supabase-js lovable-tagger
```

### 4.2 Update Package.json

```bash
# Replace package.json with cleaned version
cp package.new.json package.json

# Install updated dependencies
npm install
```

### 4.3 Update Vite Configuration

```bash
# Replace vite config
cp vite.config.new.ts vite.config.ts
```

### 4.4 Remove Supabase Integration

```bash
# Remove Supabase integration directory
rm -rf src/integrations/supabase

# The new API client is already in src/lib/apiClient.ts
```

### 4.5 Update Frontend Environment

```bash
# Create frontend .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_NODE_ENV=development
EOF
```

---

## 🔧 Phase 5: Code Migration

### 5.1 Update Hooks

Replace all Supabase hooks with new API client hooks:

```bash
# Update each hook file
cp src/hooks/useNews.new.ts src/hooks/useNews.ts
cp src/hooks/useProjects.new.ts src/hooks/useProjects.ts
cp src/hooks/useStaff.new.ts src/hooks/useStaff.ts
cp src/hooks/useGallery.new.ts src/hooks/useGallery.ts
cp src/hooks/useWebsiteImages.new.ts src/hooks/useWebsiteImages.ts
```

### 5.2 Update Authentication Context

```bash
# Replace authentication context
cp src/contexts/StaffAuthContext.new.tsx src/contexts/StaffAuthContext.tsx
```

### 5.3 Update Remaining Hook Files

For hooks not provided in the migration files, manually update them to use the new API client instead of Supabase:

1. Replace `supabase` imports with `apiClient` imports
2. Update function calls to use the new API methods
3. Update error handling to match the new API response format

---

## 🔧 Phase 6: Testing & Verification

### 6.1 Start Both Servers

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd ..
npm run dev
```

### 6.2 Basic Functionality Test

1. **Visit Homepage**: http://localhost:8080
2. **Test Navigation**: Click through all menu items
3. **Test Staff Login**: Go to `/staff-login`
   - Email: `aland.surchi456@gmail.com`
   - Password: `Aa11don.,`
4. **Test Dashboard**: After login, verify CRUD operations work

### 6.3 Comprehensive Testing

Follow the **POST_MIGRATION_VERIFICATION.md** guide for complete testing.

---

## 🔧 Phase 7: Cleanup

### 7.1 Remove Migration Files

```bash
# Remove temporary migration files
rm -f package.new.json
rm -f vite.config.new.ts
rm -rf src/hooks/*.new.*
rm -rf src/contexts/*.new.*
```

### 7.2 Update Git Repository

```bash
# Commit all changes
git add .
git commit -m "Complete migration from Lovable+Supabase to Vite+Express+MongoDB"
git tag post-migration-complete
```

---

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. Backend Won't Start
```bash
# Check MongoDB connection
mongosh
# If connection fails, ensure MongoDB is running

# Check environment variables
cat backend/.env
# Ensure all required variables are set
```

#### 2. Frontend API Calls Fail
```bash
# Check if backend is running
curl http://localhost:5000/health

# Check browser network tab for CORS errors
# Ensure CORS_ORIGINS includes frontend URL
```

#### 3. Authentication Not Working
```bash
# Test login endpoint directly
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aland.surchi456@gmail.com","password":"Aa11don.,"}'
```

#### 4. Data Missing After Migration
```bash
# Check MongoDB collections
mongosh
use org_website
db.news.find().limit(5)

# If data is missing, re-run migration
node dist/utils/migrateData.js
```

---

## ✅ Success Criteria

Your migration is successful when:

1. ✅ Homepage loads without errors
2. ✅ All navigation works correctly
3. ✅ Staff login functions properly
4. ✅ Dashboard CRUD operations work
5. ✅ All data is visible and correct
6. ✅ No console errors in browser
7. ✅ Multi-language switching works
8. ✅ Responsive design maintained

---

## 📚 What Changed

### Removed:
- ❌ `@supabase/supabase-js` dependency
- ❌ `lovable-tagger` dependency
- ❌ Supabase client configuration
- ❌ Direct database calls in frontend

### Added:
- ✅ Express.js backend server
- ✅ MongoDB database with Mongoose
- ✅ JWT-based authentication
- ✅ RESTful API endpoints
- ✅ Custom API client for frontend
- ✅ File upload handling
- ✅ Rate limiting and security middleware

### Benefits of New Architecture:
- 🚀 **Better Performance**: Optimized API endpoints
- 🔒 **Enhanced Security**: Custom authentication and authorization
- 📈 **Scalability**: Full control over backend logic
- 💰 **Cost Effective**: No vendor lock-in
- 🛠️ **Maintainability**: Standard tech stack

---

## 🎉 Next Steps

After successful migration:

1. **Performance Optimization**
   - Add Redis caching for frequently accessed data
   - Implement API response compression
   - Optimize MongoDB queries with indexes

2. **Production Deployment**
   - Set up CI/CD pipeline
   - Configure production environment variables
   - Set up monitoring and logging

3. **Enhanced Features**
   - Add real-time notifications
   - Implement advanced search
   - Add API versioning

**Congratulations! You've successfully migrated your website to a modern, scalable architecture!** 🎊
