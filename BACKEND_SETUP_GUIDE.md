# 🎯 Charity Staff Dashboard - Complete Setup Guide

## ✅ What We've Built

Your charity staff dashboard has been rebuilt with:

### Backend (Node.js + MongoDB)
- **Express.js API** with comprehensive endpoints
- **MongoDB** data models for all content types
- **JWT Authentication** with role-based access
- **File Upload Support** for images
- **RESTful API** design

### Data Models Implemented
- **Hero Image**: Main banner management
- **News**: Article management with images
- **Projects**: Project tracking with status
- **Gallery**: Photo gallery management
- **Users**: Staff authentication system

## 🚀 Quick Start

### 1. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure MongoDB:**
   - Edit `backend/.env`
   - Replace `<db_password>` with your actual MongoDB password
   ```env
   MONGO_URI=mongodb+srv://REMOVED
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   
   Server will start at: http://localhost:5000

### 2. Test the API

Visit http://localhost:5000 in your browser to see:
```json
{
  "message": "Charity Dashboard API Running",
  "version": "1.0.0",
  "endpoints": [
    "/api/hero",
    "/api/news", 
    "/api/projects",
    "/api/gallery",
    "/api/auth"
  ]
}
```

### 3. Frontend Integration

Your React frontend can now connect to the backend using the API service located at:
`src/lib/charityDashboardAPI.js`

Example usage:
```javascript
import api from './lib/charityDashboardAPI';

// Fetch all news
const news = await api.getAllNews();

// Upload hero image
await api.uploadHeroImage(imageFile);

// Create new project
await api.createProject('New Project', 'Description', 'active', imageFile);
```

## 📁 Project Structure

```
my-org/
├── backend/                    # Node.js Backend
│   ├── models/                # MongoDB Models
│   │   ├── HeroImage.js
│   │   ├── News.js
│   │   ├── Project.js
│   │   ├── GalleryPhoto.js
│   │   └── User.js
│   ├── routes/                # API Routes
│   │   ├── hero.js
│   │   ├── news.js
│   │   ├── projects.js
│   │   ├── gallery.js
│   │   └── auth.js
│   ├── uploads/               # File Upload Storage
│   │   ├── hero/
│   │   ├── news/
│   │   ├── projects/
│   │   └── gallery/
│   ├── .env                   # Environment Variables
│   ├── index.js              # Main Server File
│   └── package.json
│
├── src/                       # React Frontend
│   ├── lib/
│   │   └── charityDashboardAPI.js  # API Integration
│   └── ... (existing frontend)
│
└── ... (existing files)
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token

### Hero Image
- `GET /api/hero` - Get current hero image
- `POST /api/hero` - Upload new hero image

### News Management
- `GET /api/news` - Get all news
- `POST /api/news` - Create news article
- `PUT /api/news/:id` - Update news article
- `DELETE /api/news/:id` - Delete news article

### Projects Management
- `GET /api/projects` - Get all projects
- `GET /api/projects?status=active` - Filter by status
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Gallery Management
- `GET /api/gallery` - Get all photos
- `POST /api/gallery` - Upload new photo
- `PUT /api/gallery/:id` - Update photo caption
- `DELETE /api/gallery/:id` - Delete photo

## 🔐 Authentication Setup

### Create First Admin User

1. **Start the backend server**
2. **Use POST request to register:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@charity.org",
       "password": "secure_password",
       "role": "admin"
     }'
   ```

3. **Login to get token:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@charity.org",
       "password": "secure_password"
     }'
   ```

## 📤 File Upload Testing

### Upload Hero Image
```bash
curl -X POST http://localhost:5000/api/hero \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "heroImage=@/path/to/image.jpg"
```

### Create News with Image
```bash
curl -X POST http://localhost:5000/api/news \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Breaking News" \
  -F "content=This is the news content" \
  -F "image=@/path/to/image.jpg"
```

## 🛠️ Next Steps

### 1. Update Your React Components

Replace your existing Supabase calls with the new API service:

```javascript
// OLD (Supabase)
const { data } = await supabase.from('news').select('*');

// NEW (Your API)
const data = await api.getAllNews();
```

### 2. Add Environment Variables

Add to your frontend `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Update Your Forms

Modify your forms to work with the new API endpoints and file upload system.

### 4. Deploy

When ready to deploy:
- **Backend**: Deploy to Railway, Render, or DigitalOcean
- **Frontend**: Deploy to Vercel or Netlify
- **Database**: Use MongoDB Atlas (already configured)

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure your MongoDB password is correct in `.env`
- Check MongoDB Atlas network access settings
- Verify your IP is whitelisted

### CORS Issues
- The backend has CORS enabled for all origins
- In production, configure specific origins

### File Upload Issues
- Check that upload directories exist
- Verify file size limits (5MB default)
- Ensure proper file types (images only)

## 🎉 Success!

Your charity dashboard now has a complete Node.js + MongoDB backend with:
- ✅ Full CRUD operations for all content types
- ✅ Image upload capabilities
- ✅ User authentication and authorization
- ✅ RESTful API design
- ✅ File organization and error handling
- ✅ Ready for production deployment

The backend is running at http://localhost:5000 and ready to serve your React frontend!
