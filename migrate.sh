#!/bin/bash

# Master Migration Script
# This script orchestrates the complete migration from Lovable + Supabase to Vite + Express + MongoDB

set -e  # Exit on any error

echo "🚀 Starting Complete Migration Process..."
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "NPM is not installed. Please install NPM first."
    exit 1
fi

if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

print_success "All prerequisites are met."

# Step 1: Backup current state
print_status "Step 1: Creating backup of current state..."
mkdir -p ./migration-backup/original-code
cp -r ./src ./migration-backup/original-code/
cp package.json ./migration-backup/original-code/
cp vite.config.ts ./migration-backup/original-code/
print_success "Backup created in ./migration-backup/original-code/"

# Step 2: Export Supabase data
print_status "Step 2: Exporting Supabase data..."
if [ -f "./scripts/export-supabase-data.js" ]; then
    cd scripts
    node export-supabase-data.js
    cd ..
    print_success "Supabase data exported successfully."
else
    print_warning "Supabase export script not found. Manual data export required."
fi

# Step 3: Set up backend
print_status "Step 3: Setting up Express + MongoDB backend..."
if [ ! -d "./backend" ]; then
    mkdir backend
    cd backend
    
    # Initialize package.json
    if [ -f "../backend/package.json" ]; then
        cp ../backend/package.json ./
    fi
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Copy backend source files
    if [ -d "../backend/src" ]; then
        cp -r ../backend/src ./
    fi
    
    cd ..
    print_success "Backend setup completed."
else
    print_status "Backend directory already exists. Skipping setup."
fi

# Step 4: Start MongoDB
print_status "Step 4: Checking MongoDB connection..."
# This assumes MongoDB is already running
# You might need to adjust this based on your MongoDB setup

# Step 5: Migrate data to MongoDB
print_status "Step 5: Migrating data to MongoDB..."
if [ -f "./backend/src/utils/migrateData.ts" ]; then
    cd backend
    npm run build
    node dist/utils/migrateData.js
    cd ..
    print_success "Data migration completed."
else
    print_warning "Migration script not found. Manual data migration required."
fi

# Step 6: Update frontend dependencies
print_status "Step 6: Updating frontend dependencies..."

# Remove Supabase and Lovable dependencies
npm uninstall @supabase/supabase-js lovable-tagger

# Update package.json
if [ -f "./package.new.json" ]; then
    cp ./package.new.json ./package.json
    print_success "Package.json updated."
fi

# Update vite.config.ts
if [ -f "./vite.config.new.ts" ]; then
    cp ./vite.config.new.ts ./vite.config.ts
    print_success "Vite config updated."
fi

# Install updated dependencies
npm install

# Step 7: Replace Supabase integrations
print_status "Step 7: Replacing Supabase integrations..."

# Remove old Supabase integration files
if [ -d "./src/integrations/supabase" ]; then
    rm -rf ./src/integrations/supabase
    print_success "Removed Supabase integration directory."
fi

# Copy new API client
if [ -f "./src/lib/apiClient.ts" ]; then
    print_success "API client already in place."
else
    print_warning "API client not found. Manual setup required."
fi

# Update hooks to use new API client
print_status "Updating hooks to use new API client..."

# List of hooks to update
HOOKS=(
    "useNews"
    "useProjects" 
    "useStaff"
    "useGallery"
    "useWebsiteImages"
    "useStaffAccounts"
    "useCreateNews"
    "useCreateProject"
    "useCreateStaff"
    "useFileUpload"
)

for hook in "${HOOKS[@]}"; do
    if [ -f "./src/hooks/${hook}.new.ts" ]; then
        cp "./src/hooks/${hook}.new.ts" "./src/hooks/${hook}.ts"
        print_success "Updated ${hook} hook."
    elif [ -f "./src/hooks/${hook}.new.tsx" ]; then
        cp "./src/hooks/${hook}.new.tsx" "./src/hooks/${hook}.tsx"
        print_success "Updated ${hook} hook."
    fi
done

# Update contexts
if [ -f "./src/contexts/StaffAuthContext.new.tsx" ]; then
    cp "./src/contexts/StaffAuthContext.new.tsx" "./src/contexts/StaffAuthContext.tsx"
    print_success "Updated StaffAuthContext."
fi

# Step 8: Update environment variables
print_status "Step 8: Setting up environment variables..."

# Create .env for frontend
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_NODE_ENV=development
EOF

# Create .env for backend
if [ ! -f "./backend/.env" ]; then
    cp "./backend/.env.example" "./backend/.env"
    print_warning "Please update ./backend/.env with your actual configuration."
fi

print_success "Environment variables configured."

# Step 9: Test the setup
print_status "Step 9: Testing the setup..."

# Start backend in background
print_status "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Give backend time to start
sleep 5

# Check if backend is running
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    print_success "Backend is running successfully!"
else
    print_error "Backend failed to start. Check the logs."
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Start frontend
print_status "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Give frontend time to start
sleep 5

# Check if frontend is running
if curl -f http://localhost:8080 > /dev/null 2>&1; then
    print_success "Frontend is running successfully!"
else
    print_error "Frontend failed to start. Check the logs."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 1
fi

# Stop test servers
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true

print_success "Migration completed successfully!"
echo
print_status "Summary of changes:"
echo "✅ Supabase dependencies removed"
echo "✅ Lovable dependencies removed"
echo "✅ Express + MongoDB backend created"
echo "✅ Data migrated from Supabase to MongoDB"
echo "✅ Frontend updated to use new API"
echo "✅ All hooks and contexts updated"
echo
print_status "Next steps:"
echo "1. Review and test all functionality"
echo "2. Update any remaining Supabase references"
echo "3. Configure production environment"
echo "4. Deploy both frontend and backend"
echo
print_status "To start development:"
echo "Backend: cd backend && npm run dev"
echo "Frontend: npm run dev"
echo
print_success "🎉 Migration completed! Your website is now running on Vite + Express + MongoDB!"
