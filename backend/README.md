# Charity Dashboard Backend

A Node.js + Express + MongoDB backend for managing charity staff dashboard content.

## Features

- **Hero Image Management**: Upload and update hero banner images
- **News Management**: Create, read, update, delete news articles with images
- **Project Management**: Manage charity projects with status tracking
- **Gallery Management**: Upload and organize photo gallery
- **User Authentication**: JWT-based login system with role-based access
- **File Upload**: Image upload support with validation

## Data Models

### Hero Image
- `url`: Image URL
- `updatedAt`: Last update timestamp

### News
- `title`: Article title
- `content`: Article content
- `imageUrl`: Featured image URL
- `createdAt`, `updatedAt`: Timestamps

### Projects
- `title`: Project title
- `description`: Project description
- `status`: active | completed | planned | on-hold
- `imageUrl`: Project image URL
- `createdAt`, `updatedAt`: Timestamps

### Gallery Photos
- `url`: Photo URL
- `caption`: Photo caption
- `uploadedAt`: Upload timestamp

### Users
- `email`: User email (unique)
- `password`: Hashed password
- `role`: admin | staff
- `createdAt`: Registration timestamp

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_strong_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Hero Image
- `GET /api/hero` - Get current hero image
- `POST /api/hero` - Upload new hero image
- `PUT /api/hero` - Update hero image

### News
- `GET /api/news` - Get all news
- `GET /api/news/:id` - Get single news
- `POST /api/news` - Create news (with image upload)
- `PUT /api/news/:id` - Update news
- `DELETE /api/news/:id` - Delete news

### Projects
- `GET /api/projects` - Get all projects (optional ?status filter)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (with image upload)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Gallery
- `GET /api/gallery` - Get all photos
- `GET /api/gallery/:id` - Get single photo
- `POST /api/gallery` - Upload photo
- `PUT /api/gallery/:id` - Update photo caption
- `DELETE /api/gallery/:id` - Delete photo

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/users` - Get all users (admin only)

## File Upload

Images are uploaded to the `uploads/` directory with the following structure:
- `uploads/hero/` - Hero images
- `uploads/news/` - News article images
- `uploads/projects/` - Project images
- `uploads/gallery/` - Gallery photos

## Security Features

- Password hashing with bcrypt
- JWT authentication
- Role-based access control
- File type validation for uploads
- File size limits
- CORS enabled

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGO_URI | MongoDB connection string | Required |
| PORT | Server port | 5000 |
| JWT_SECRET | JWT signing secret | Required |

## Development

Start the development server with auto-reload:
```bash
npm run dev
```

Start production server:
```bash
npm start
```
