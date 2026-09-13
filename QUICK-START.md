# 🚀 Fleet & Shipment Tracking System - QUICK START GUIDE

**Project Deadline:** September 11, 2026 (5 Days)  
**Current Status:** DAY 1 - BACKEND SETUP COMPLETE ✅

---

## 📦 What's Included (Day 1)

### Backend Files (Ready to Use)
```
✅ server-package.json          - All dependencies
✅ server-src-server.js         - Express + Socket.IO setup
✅ server-src-config-db.js      - MongoDB connection
✅ server-src-middleware-auth.js - JWT authentication
✅ server-src-models-*.js       - 7 Database models
✅ server-src-routes-*.js       - 30+ API endpoints
✅ server-env-example           - Environment template
✅ DAY1-SETUP.md                - Detailed setup guide
```

---

## 🔧 INSTALLATION (10 minutes)

### 1. Create Project Structure
```bash
mkdir fleet-shipment-tracking
cd fleet-shipment-tracking

# Create folders
mkdir -p server/src/{config,models,middleware,routes}
cd server
```

### 2. Setup Dependencies
```bash
# Copy package.json
cp ../server-package.json package.json

# Install all dependencies
npm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp ../server-env-example .env

# Edit with your values (nano, vim, or VSCode)
# IMPORTANT: Set your JWT_SECRET and MONGO_URI
nano .env
```

**Key values to set in `.env`:**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/fleet-tracking
JWT_SECRET=your-random-secret-key-here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 4. Copy Backend Files
```bash
# Copy all files to correct directories
cp ../server-src-server.js src/server.js
cp ../server-src-config-db.js src/config/db.js
cp ../server-src-middleware-auth.js src/middleware/auth.js

# Copy all models
cp ../server-src-models-*.js src/models/

# Copy all routes
cp ../server-src-routes-*.js src/routes/
```

### 5. Start the Server
```bash
npm run dev
```

**Expected output:**
```
🚀 Fleet Tracking Server running on port 5000
📍 Environment: development
🗄️  Database: MongoDB
🔌 WebSocket enabled for real-time tracking
```

---

## 🧪 Test the Backend

### Check Server Health
```bash
curl http://localhost:5000/api/v1/health
```

### Create Admin User (Signup)
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@fleet.com",
    "password": "password123",
    "role": "super_admin"
  }'
```

**Response:** You'll get a JWT token - save it!

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fleet.com",
    "password": "password123"
  }'
```

### Create a Vehicle (use token from signup)
```bash
TOKEN="your-token-here"

curl -X POST http://localhost:5000/api/v1/vehicles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleId": "V-001",
    "registrationNumber": "ABC-1234",
    "type": "truck",
    "make": "Hino",
    "model": "500",
    "year": 2023,
    "capacity": 5000
  }'
```

---

## 📊 API Endpoints (Ready Today)

### 🔐 Authentication
- `POST /api/v1/auth/signup` - Register user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

### 👥 Users
- `GET /api/v1/users` - List all users
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### 🚗 Vehicles
- `GET /api/v1/vehicles` - List vehicles
- `POST /api/v1/vehicles` - Create vehicle
- `PUT /api/v1/vehicles/:id` - Update vehicle
- `PATCH /api/v1/vehicles/:id/status` - Change status
- `PATCH /api/v1/vehicles/:id/assign-driver` - Assign driver
- `DELETE /api/v1/vehicles/:id` - Delete vehicle

### 👨‍✈️ Drivers
- `GET /api/v1/drivers` - List drivers
- `POST /api/v1/drivers` - Create driver
- `PUT /api/v1/drivers/:id` - Update driver
- `DELETE /api/v1/drivers/:id` - Delete driver

### 📦 Shipments
- `GET /api/v1/shipments` - List shipments
- `POST /api/v1/shipments` - Create shipment
- `PATCH /api/v1/shipments/:id/status` - Update status
- `PATCH /api/v1/shipments/:id/assign` - Assign to vehicle/driver

### 📍 Tracking
- `GET /api/v1/tracking/vehicles` - Get all vehicle locations
- `GET /api/v1/tracking/vehicles/:id` - Get vehicle location
- `GET /api/v1/tracking/history/:vehicleId` - Get location history
- `GET /api/v1/tracking/shipments/:id` - Track shipment

### 📌 Locations
- `POST /api/v1/locations` - Update vehicle location (GPS)
- `GET /api/v1/locations/:vehicleId` - Get latest location
- `GET /api/v1/locations/:vehicleId/history` - Get location history

---

## 🏗️ Database Models

### User Model
- Name, Email, Password (hashed)
- Role (super_admin, fleet_manager, dispatcher, operations_manager, viewer)
- Profile image, phone, last login tracking

### Vehicle Model
- Vehicle ID, Registration, Type (truck, van, etc.)
- Make, Model, Year, Capacity
- Current location with geospatial indexing
- Status (available, in_transit, idle, maintenance, offline)
- Assigned driver tracking

### Driver Model
- Driver ID, Name, Email, Phone
- License number and expiry
- Years of experience
- Current location and status
- Performance metrics (trips, deliveries, rating)

### Shipment Model
- Shipment ID, Tracking number
- Customer information
- Pickup and delivery locations
- Package details (weight, quantity, dimensions)
- Assignment (vehicle, driver, route)
- Status tracking with timeline
- Priority levels (low, normal, high, urgent)

### Location Model
- Vehicle ID reference
- GPS coordinates (latitude, longitude)
- Speed, heading, accuracy
- Timestamp with automatic 30-day expiration
- Geospatial indexing for location queries

### Route Model
- Route ID, Name
- Origin and destination
- Multiple stops support
- Distance and duration
- Traffic status tracking
- Vehicle and driver assignment

### Alert Model
- Alert type (11 types supported)
- Severity levels (info, warning, critical)
- Status tracking (unresolved → resolved)
- Associated vehicle, driver, or shipment
- Timestamp with automatic indexing

---

## 🔑 Key Features Implemented

✅ **Authentication & Authorization**
- JWT token-based authentication
- Role-based access control (5 roles)
- Password hashing with bcrypt
- Token expiration and refresh

✅ **Real-time Communication**
- Socket.IO integration
- Vehicle location broadcasting
- Status update notifications
- Shipment event streaming

✅ **Data Persistence**
- MongoDB schemas with validation
- Geospatial indexing for location queries
- TTL indexes for automatic data cleanup
- Complex relationships between entities

✅ **API Structure**
- RESTful endpoints
- Input validation
- Error handling
- Status codes (200, 201, 400, 401, 403, 404, 500)

---

## 📋 Database Relationships

```
User
  ├─ Vehicles (created)
  ├─ Shipments (created)
  └─ Alerts (resolved)

Vehicle
  ├─ Driver (assigned)
  ├─ Shipments (carrying)
  ├─ Locations (GPS history)
  ├─ Routes (assigned)
  └─ Alerts (related)

Driver
  ├─ Vehicle (assigned)
  ├─ Shipments (delivering)
  ├─ Locations (GPS history)
  └─ Alerts (related)

Shipment
  ├─ Vehicle (assigned)
  ├─ Driver (assigned)
  ├─ Route (assigned)
  ├─ Locations (tracking)
  └─ Alerts (related)

Route
  ├─ Vehicle (assigned)
  ├─ Driver (assigned)
  ├─ Shipments (multiple)
  └─ Locations (waypoints)
```

---

## 🛠️ Troubleshooting

### Issue: "Cannot find module 'express'"
**Solution:** Run `npm install`

### Issue: "MONGO_URI is not defined"
**Solution:** Check `.env` file is created and has `MONGO_URI` set

### Issue: "Port 5000 already in use"
**Solution:** 
- Change port in `.env`: `PORT=5001`
- Or kill the process: `lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9`

### Issue: "MongoDB connection failed"
**Solution:**
- Ensure MongoDB is running: `mongod`
- Or use MongoDB Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/fleet-tracking`

### Issue: "CORS error from frontend"
**Solution:** Ensure `CLIENT_URL` in `.env` matches your frontend URL (should be http://localhost:5173)

---

## 📅 WHAT'S NEXT (DAY 2-5)

### 🎯 Day 2 (Sep 7): Frontend Setup & APIs Connection
- React + Vite project initialization
- Component structure setup
- Connect to backend APIs
- Authentication integration

### 🎯 Day 3 (Sep 8): Real-time Tracking
- Socket.IO client setup
- Live map with vehicle markers
- Real-time location updates
- Shipment tracking visualization

### 🎯 Day 4 (Sep 9): Dashboard & Management UIs
- Admin dashboard with stats
- Vehicle management interface
- Driver management interface
- Shipment management interface
- Alert notifications

### 🎯 Day 5 (Sep 10): Polish & Deployment
- Bug fixes and optimization
- UI refinement
- Deployment to production
- Final testing and submission

---

## 💡 Quick Tips

1. **Save your JWT token** after login to test protected routes
2. **Use Postman or Thunder Client** for easier API testing
3. **Enable MongoDB Atlas** for cloud database (recommended for production)
4. **Keep terminal running** for `npm run dev` while developing
5. **Check logs carefully** for error messages - they help debug issues

---

## 📞 Common API Call Patterns

### With Authentication Token
```bash
TOKEN="your-token-from-login"

curl -X GET http://localhost:5000/api/v1/vehicles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Creating Resources
```bash
curl -X POST http://localhost:5000/api/v1/drivers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "driverId": "D-001",
    "name": "John Doe",
    "phone": "0300-1234567",
    "licenseNumber": "LIC-001",
    "licenseExpiry": "2026-12-31"
  }'
```

### Updating Resources
```bash
curl -X PUT http://localhost:5000/api/v1/drivers/DRIVER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "experience": 5
  }'
```

### Deleting Resources
```bash
curl -X DELETE http://localhost:5000/api/v1/drivers/DRIVER_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## ✅ Day 1 Completion Checklist

- [ ] Installed Node.js dependencies
- [ ] Created `.env` file with proper configuration
- [ ] Copied all backend files to correct directories
- [ ] Started server with `npm run dev`
- [ ] Tested health endpoint
- [ ] Created test user (signup)
- [ ] Tested login endpoint
- [ ] Created test vehicle
- [ ] Created test driver
- [ ] Reviewed API endpoints

**If all checkboxes are done, you're ready for Day 2!** 🎉

---

## 📚 File Naming Convention

- `server-src-*.js` → Copy to `src/` (remove `server-src-` prefix)
- `server-package.json` → Rename to `package.json`
- `server-env-example` → Rename to `.env`

**Example:**
```
server-src-models-User.js → src/models/User.js
server-src-routes-authRoutes.js → src/routes/authRoutes.js
```

---

**Good Luck! Remember: Break each day's tasks into smaller chunks.** 💪

Questions? Stuck? Check `DAY1-SETUP.md` for detailed troubleshooting!
