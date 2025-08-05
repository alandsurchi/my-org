@echo off
cd /d "C:\Users\aland\Desktop\test-2\my-org\backend"
set MONGO_URI=mongodb+srv://REMOVED
set PORT=5000
set JWT_SECRET=REMOVED_SECRET
node index.js
