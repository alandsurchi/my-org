Set-Location "C:\Users\aland\Desktop\test-2\my-org\backend"
$env:MONGO_URI = "mongodb+srv://REMOVED"
$env:PORT = "5000"
$env:JWT_SECRET = "REMOVED_SECRET"
node index.js
