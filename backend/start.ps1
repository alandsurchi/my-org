Set-Location "C:\Users\aland\Desktop\test-2\my-org\backend"
$env:MONGO_URI = "mongodb+srv://alandsurchi456:LKGdcGLn8Ff6co0N@cluster2.tqyiib8.mongodb.net/charity-dashboard?retryWrites=true&w=majority&appName=Cluster2"
$env:PORT = "5000"
$env:JWT_SECRET = "charity_dashboard_super_secret_jwt_key_2024_change_in_production"
node index.js
