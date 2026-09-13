# 🚀 COMPLETE INSTALLATION GUIDE - DAY 1

**Time Required:** 15-20 minutes  
**Status:** Ready to Execute

---

## 📦 What You Have

All backend files are included and organized:
- ✅ Express server with Socket.IO
- ✅ 7 Database models (User, Vehicle, Driver, Shipment, Location, Route, Alert)
- ✅ 7 Route files with 30+ API endpoints
- ✅ Middleware (authentication, validation, error handling)
- ✅ Utility functions (validators, helpers, ID generators)
- ✅ Seed data (test users, vehicles, drivers, shipments)
- ✅ Environment template
- ✅ Automated setup scripts

---

## 🖥️ STEP-BY-STEP INSTALLATION

### STEP 1: Prerequisites Check ✅

#### Windows Users:
1. Download Node.js from https://nodejs.org/ (LTS version)
2. Install with default settings
3. Open Command Prompt and verify:
```bash
node --version
npm --version
```

#### macOS Users:
```bash
# Using Homebrew
brew install node

# Verify
node --version
npm --version
```

#### Linux Users:
```bash
# Ubuntu/Debian
sudo apt-get install nodejs npm

# Verify
node --version
npm --version
```

**MongoDB:** You need either:
- Local MongoDB (`mongod` running), OR
- MongoDB Atlas (cloud) account

---

### STEP 2: Create Project Folder

#### Windows:
```bash
# Open Command Prompt (Win + R, type "cmd", Enter)
cd Desktop
mkdir fleet-tracking
cd fleet-tracking
```

#### macOS/Linux:
```bash
cd ~/Desktop
mkdir fleet-tracking
cd fleet-tracking
```

---

### STEP 3: Extract/Copy Backend Files

1. **Extract all downloaded files into the `fleet-tracking` folder**
   - Your folder should have these files:
   ```
   fleet-tracking/
   ├── server-package.json
   ├── server-src-server.js
   ├── server-src-config-db.js
   ├── server-src-middleware-auth.js
   ├── server-src-models-*.js (7 files)
   ├── server-src-routes-*.js (7 files)
   ├── middleware-*.js (2 files)
   ├── utils-*.js (2 files)
   ├── seeders-seedData.js
   ├── server-env-example
   ├── SETUP.sh (or SETUP.bat for Windows)
   ├── README.md
   ├── QUICK-START.md
   ├── gitignore
   └── ... other docs
   ```

---

### STEP 4: Run Automated Setup

#### Option A: Automated Setup (Recommended)

**Windows:**
```bash
SETUP.bat
```

**macOS/Linux:**
```bash
chmod +x SETUP.sh
./SETUP.sh
```

**This will automatically:**
- ✅ Check Node.js & npm
- ✅ Create directory structure
- ✅ Generate .env file
- ✅ Install dependencies
- ✅ Organize all files

---

#### Option B: Manual Setup (If Script Fails)

**Step 4a: Create Folder Structure**
```bash
mkdir -p server/src/{config,models,middleware,routes,utils}
mkdir -p server/seeders
cd server
```

**Step 4b: Copy Files**
```bash
# Copy package.json
cp ../package.json .

# Create directories
mkdir -p src/{config,models,middleware,routes,utils}
mkdir -p seeders

# Copy server files
cp ../server-src-server.js src/server.js
cp ../server-src-config-db.js src/config/db.js
cp ../server-src-middleware-auth.js src/middleware/auth.js

# Copy models (all 7)
cp ../server-src-models-User.js src/models/
cp ../server-src-models-Vehicle.js src/models/
cp ../server-src-models-Driver.js src/models/
cp ../server-src-models-Shipment.js src/models/
cp ../server-src-models-Location.js src/models/
cp ../server-src-models-Route.js src/models/
cp ../server-src-models-Alert.js src/models/

# Copy routes (all 7)
cp ../server-src-routes-authRoutes.js src/routes/
cp ../server-src-routes-userRoutes.js src/routes/
cp ../server-src-routes-vehicleRoutes.js src/routes/
cp ../server-src-routes-driverRoutes.js src/routes/
cp ../server-src-routes-shipmentRoutes.js src/routes/
cp ../server-src-routes-trackingRoutes.js src/routes/
cp ../server-src-routes-locationRoutes.js src/routes/

# Copy middleware
cp ../middleware-errorHandler.js src/middleware/
cp ../middleware-validation.js src/middleware/

# Copy utils
cp ../utils-helpers.js src/utils/
cp ../utils-validators.js src/utils/

# Copy seeders
cp ../seeders-seedData.js seeders/

# Copy .gitignore
cp ../gitignore .gitignore

# Create .env file
cp ../server-env-example .env
```

**Step 4c: Install Dependencies**
```bash
npm install
```

This takes 2-3 minutes. You'll see lots of text - this is normal! ✅

---

### STEP 5: Configure Environment

**Open `.env` file** with any text editor (Notepad, VS Code, etc.)

Find these lines and update:

```env
# You can leave these as-is for local testing
PORT=5000
NODE_ENV=development

# MongoDB - CHOOSE ONE:
# Option A: Local MongoDB (if mongod is running)
MONGO_URI=mongodb://localhost:27017/fleet-tracking

# Option B: MongoDB Atlas (recommended for production)
# MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/fleet-tracking

# JWT - Generate a random secret (change this!)
JWT_SECRET=your-super-secret-key-12345-change-this
JWT_EXPIRES_IN=7d

# Keep these as-is for frontend connection
CLIENT_URL=http://localhost:5173
SOCKET_URL=http://localhost:5000

# Optional (for future use)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_password
```

**Save the file.** ✅

---

### STEP 6: Start MongoDB

**Option A: Local MongoDB**

Windows:
```bash
# If installed as service, it auto-starts
# To verify: Open Services app and look for "MongoDB"

# OR manually start:
mongod
```

macOS:
```bash
brew services start mongodb-community
```

Linux:
```bash
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Paste into `.env` as MONGO_URI
- No need to start anything locally ✅

---

### STEP 7: Start the Server

```bash
npm run dev
```

**You should see:**
```
🚀 Fleet Tracking Server running on port 5000
📍 Environment: development
🗄️  Database: MongoDB
🔌 WebSocket enabled for real-time tracking
```

**If you see this, you're DONE with installation!** 🎉

---

## 🧪 STEP 8: Test the Server

### Test 1: Health Check
Open new terminal and run:
```bash
curl http://localhost:5000/api/v1/health
```

**Expected Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2024-09-06T15:30:00.000Z"
}
```

### Test 2: User Registration
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Admin",
    "email": "test@fleet.com",
    "password": "password123",
    "role": "super_admin"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "Test Admin",
    "email": "test@fleet.com",
    "role": "super_admin"
  }
}
```

**💾 SAVE this token!** You'll need it for next tests.

### Test 3: User Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@fleet.com",
    "password": "password123"
  }'
```

### Test 4: Get Current User
Replace TOKEN with your token from signup:
```bash
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Test 5: Create a Vehicle
```bash
curl -X POST http://localhost:5000/api/v1/vehicles \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleId": "V-TEST-001",
    "registrationNumber": "XYZ-1234",
    "type": "truck",
    "make": "Hino",
    "model": "500",
    "year": 2023,
    "capacity": 5000
  }'
```

---

## 📊 STEP 9: (Optional) Seed Test Data

To populate database with 30+ test records:

```bash
npm run seed
```

**Creates:**
- 4 test users
- 3 drivers
- 3 vehicles
- 3 shipments
- 1 route
- 2 alerts

**Test Credentials:**
- Email: `admin@fleet.com`
- Password: `password123`
- Role: `super_admin`

---

## ✅ VERIFICATION CHECKLIST

- [ ] Node.js installed and version displayed
- [ ] npm installed and version displayed
- [ ] Project folder created
- [ ] All backend files extracted
- [ ] Dependencies installed (npm install completed)
- [ ] .env file created with values
- [ ] MongoDB running (or Atlas connected)
- [ ] Server starts with `npm run dev`
- [ ] Health check endpoint responds
- [ ] User registration works
- [ ] User login works
- [ ] Can create a vehicle
- [ ] (Optional) Database seeding works

**If ALL items checked ✅ YOU'RE READY FOR DAY 2!** 🚀

---

## 🆘 TROUBLESHOOTING

### "npm command not found"
```bash
# Reinstall Node.js from https://nodejs.org/
# Make sure to check "Add to PATH" during installation
```

### "Cannot find module..."
```bash
# Solution: Install dependencies
npm install
```

### "MONGO_URI is not defined"
```bash
# Solution: Edit .env file and set MONGO_URI
nano .env  # Edit and save
```

### "Port 5000 already in use"
```bash
# Solution 1: Change port in .env
# PORT=5001

# Solution 2: Kill process using port
# Windows: netstat -ano | findstr :5000 (find PID, then: taskkill /PID <PID> /F)
# macOS/Linux: lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### "MongoDB connection refused"
```bash
# Solution 1: Start MongoDB locally
mongod

# Solution 2: Use MongoDB Atlas instead
# Get connection string from Atlas and update MONGO_URI in .env
```

### "JWT verification failed"
```bash
# Solution: Restart server
# Stop server (Ctrl+C)
npm run dev
```

---

## 📞 QUICK COMMANDS REFERENCE

```bash
# Start server (development)
npm run dev

# Start server (production)
npm start

# Seed database
npm run seed

# Test API
curl http://localhost:5000/api/v1/health

# Stop server
# Press Ctrl+C in terminal

# View logs
# Check terminal window running `npm run dev`

# Clear database (MongoDB)
# mongo
# use fleet-tracking
# db.dropDatabase()
```

---

## 🎯 WHAT'S NEXT

After completing Day 1 setup, you're ready for:

**Day 2:** Frontend setup & API connection
- React + Vite project
- Authentication UI
- Basic dashboard
- API integration

---

## 📝 NOTES

- Keep terminal running while developing (`npm run dev`)
- All timestamps are UTC
- JWT tokens expire after 7 days
- Location data auto-deletes after 30 days
- Passwords are hashed with bcrypt

---

## 📚 FILES INCLUDED

```
Backend Complete Package:
├── 📄 README.md - Full documentation
├── 📄 QUICK-START.md - Quick reference
├── 📄 INSTALLATION-GUIDE.md - This file
├── 📄 package.json - Dependencies
├── 📄 .env.example - Environment template
├── 🔐 src/server.js - Express server
├── 🗄️ src/config/db.js - Database config
├── 🔑 src/middleware/* - Auth & validation
├── 🗃️ src/models/* - 7 Database models
├── 🛣️ src/routes/* - 7 API route files
├── 🛠️ src/utils/* - Helpers & validators
├── 🌱 seeders/seedData.js - Test data
├── 🚀 SETUP.sh - Linux/Mac setup
├── 🚀 SETUP.bat - Windows setup
└── ... documentation files
```

---

## ✨ YOU'RE ALL SET!

**Congratulations!** Your backend is ready. 

**Next steps:**
1. Keep `npm run dev` running
2. Start Day 2 (Frontend setup)
3. Connect frontend to these APIs
4. Build the dashboard

---

**Created:** September 6, 2026  
**Deadline:** September 11, 2026 (5 days)  
**Group:** Shaheer & Syed Najam Ul Hassan

Good luck! 🚀
