# 🚀 Fleet & Shipment Live Tracking System

**MERN Stack | Real-time GPS Tracking | Live Dashboard**

![Status](https://img.shields.io/badge/status-active-success) ![Progress](https://img.shields.io/badge/progress-Day%201%20%E2%9C%85-blue) ![Deadline](https://img.shields.io/badge/deadline-Sep%2011-red)

---

## 📋 Project Overview

A comprehensive fleet management and shipment tracking system built with MERN stack enabling real-time vehicle tracking, driver management, shipment tracking, and admin dashboard.

### 🎯 Key Features
- ✅ Real-time vehicle GPS tracking with live map
- ✅ Shipment tracking and delivery management
- ✅ Driver and vehicle fleet management
- ✅ Role-based access control (5 roles)
- ✅ Real-time notifications via Socket.IO
- ✅ Alert system for fleet incidents
- ✅ Route optimization and planning
- ✅ Comprehensive admin dashboard

---

## 🏗️ Architecture

```
fleet-shipment-tracking/
├── server/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── models/           # 7 MongoDB models
│   │   ├── routes/           # 7 API route files (30+ endpoints)
│   │   ├── middleware/       # Auth, validation, error handling
│   │   └── server.js         # Express + Socket.IO setup
│   ├── package.json
│   ├── .env                  # Environment variables
│   └── seeders/              # Database seed data
│
├── client/                   # Frontend (React + Vite)
│   └── [Coming Day 2]
│
└── docs/                     # Documentation
    ├── API.md
    ├── DATABASE.md
    └── DEPLOYMENT.md
```

---

## 🔧 QUICK START (5 minutes)

### 1️⃣ Prerequisites
- Node.js 14+ (`node --version`)
- MongoDB 4.0+ or MongoDB Atlas account
- npm or yarn

### 2️⃣ Clone & Setup
```bash
# Navigate to project
cd fleet-shipment-tracking/server

# Install dependencies
npm install
```

### 3️⃣ Environment Configuration
```bash
# Create .env file
cp .env.example .env

# Edit with your values (use your text editor)
```

**Required `.env` values:**
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/fleet-tracking
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 4️⃣ Start Server
```bash
# Development mode with auto-reload
npm run dev

# OR production mode
npm start
```

**Expected output:**
```
🚀 Fleet Tracking Server running on port 5000
📍 Environment: development
🗄️  Database: MongoDB
🔌 WebSocket enabled for real-time tracking
```

### 5️⃣ Seed Test Data (Optional)
```bash
node seeders/seedData.js
```

**Creates:**
- 4 test users (admin, manager, dispatcher, ops)
- 3 drivers
- 3 vehicles
- 3 shipments
- 1 route
- 2 alerts

---

## 📊 API Endpoints Reference

### 🔐 Authentication (`/api/v1/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register new user |
| POST | `/login` | Login user |
| GET | `/me` | Get current user (protected) |

### 👥 Users (`/api/v1/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all users |
| GET | `/:id` | Get user by ID |
| POST | `/` | Create new user |
| PUT | `/:id` | Update user |
| DELETE | `/:id` | Delete user |

### 🚗 Vehicles (`/api/v1/vehicles`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all vehicles |
| GET | `/:id` | Get vehicle details |
| POST | `/` | Create vehicle |
| PUT | `/:id` | Update vehicle |
| PATCH | `/:id/status` | Update vehicle status |
| PATCH | `/:id/assign-driver` | Assign driver to vehicle |
| DELETE | `/:id` | Delete vehicle |

### 👨‍✈️ Drivers (`/api/v1/drivers`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all drivers |
| GET | `/:id` | Get driver details |
| POST | `/` | Create driver |
| PUT | `/:id` | Update driver |
| DELETE | `/:id` | Delete driver |

### 📦 Shipments (`/api/v1/shipments`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List shipments |
| GET | `/:id` | Get shipment details |
| POST | `/` | Create shipment |
| PATCH | `/:id/status` | Update shipment status |
| PATCH | `/:id/assign` | Assign to vehicle/driver/route |

### 📍 Tracking (`/api/v1/tracking`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vehicles` | Get all vehicle locations |
| GET | `/vehicles/:id` | Get vehicle location |
| GET | `/history/:vehicleId` | Get location history |
| GET | `/shipments/:id` | Track shipment |

### 📌 Locations (`/api/v1/locations`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Update vehicle location (GPS) |
| GET | `/:vehicleId` | Get latest location |
| GET | `/:vehicleId/history` | Get location history |

---

## 🧪 Testing API Endpoints

### Get Authentication Token
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@fleet.com",
    "password": "password123",
    "role": "super_admin"
  }'
```

**Response includes `token` - save this!**

### List Vehicles (Protected)
```bash
TOKEN="your-token-here"

curl http://localhost:5000/api/v1/vehicles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Create a Vehicle
```bash
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

### Update Vehicle Location (GPS)
```bash
curl -X POST http://localhost:5000/api/v1/locations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleId": "VEHICLE_ID",
    "latitude": 33.6844,
    "longitude": 73.0479,
    "speed": 60,
    "heading": 120,
    "ignitionStatus": true
  }'
```

---

## 🗄️ Database Models

### 1️⃣ User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: enum ['super_admin', 'fleet_manager', 'dispatcher', 'operations_manager', 'viewer'],
  phone: String,
  profileImage: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 2️⃣ Vehicle Model
```javascript
{
  vehicleId: String (unique),
  registrationNumber: String (unique),
  type: enum ['truck', 'van', 'container_truck', 'pickup', 'refrigerated_truck'],
  make: String,
  model: String,
  year: Number,
  capacity: Number,
  fuelType: enum ['petrol', 'diesel', 'hybrid', 'electric'],
  status: enum ['available', 'in_transit', 'idle', 'maintenance', 'offline', 'inactive'],
  currentLocation: { latitude, longitude, address, lastUpdated },
  assignedDriver: ObjectId (ref: Driver),
  insuranceExpiry: Date,
  registrationExpiry: Date,
  speedLimit: Number
}
```

### 3️⃣ Driver Model
```javascript
{
  driverId: String (unique),
  name: String,
  email: String,
  phone: String,
  licenseNumber: String (unique),
  licenseExpiry: Date,
  experience: Number (years),
  status: enum ['available', 'on_duty', 'off_duty', 'on_delivery', 'suspended'],
  assignedVehicle: ObjectId (ref: Vehicle),
  currentLocation: { latitude, longitude, address, lastUpdated },
  totalTrips: Number,
  completedDeliveries: Number,
  rating: Number (0-5),
  profileImage: String
}
```

### 4️⃣ Shipment Model
```javascript
{
  shipmentId: String (unique),
  trackingNumber: String (unique),
  customer: { name, email, phone, address },
  pickupLocation: { latitude, longitude, address },
  deliveryLocation: { latitude, longitude, address },
  packageDetails: { description, weight, quantity, dimensions },
  assignedVehicle: ObjectId (ref: Vehicle),
  assignedDriver: ObjectId (ref: Driver),
  assignedRoute: ObjectId (ref: Route),
  status: enum [created, assigned, picked_up, in_transit, at_destination, out_for_delivery, delivered, delayed, cancelled, failed],
  priority: enum [low, normal, high, urgent],
  expectedDelivery: Date,
  actualDelivery: Date,
  location: { latitude, longitude, address, lastUpdated },
  deliveryAttempts: Number
}
```

### 5️⃣ Location Model (GPS History)
```javascript
{
  vehicleId: ObjectId (ref: Vehicle),
  latitude: Number,
  longitude: Number,
  speed: Number (km/h),
  heading: Number (degrees),
  accuracy: Number (meters),
  altitude: Number (meters),
  ignitionStatus: Boolean,
  timestamp: Date (auto-expires after 30 days)
}
```

### 6️⃣ Route Model
```javascript
{
  routeId: String (unique),
  name: String,
  origin: { latitude, longitude, address },
  destination: { latitude, longitude, address },
  stops: [{ stopNumber, latitude, longitude, address, stopType }],
  totalDistance: Number (km),
  estimatedDuration: Number (minutes),
  actualDuration: Number,
  trafficStatus: enum [clear, moderate, heavy, unknown],
  assignedVehicle: ObjectId (ref: Vehicle),
  assignedDriver: ObjectId (ref: Driver),
  shipments: [ObjectId] (ref: Shipment),
  status: enum [planned, in_progress, completed, cancelled]
}
```

### 7️⃣ Alert Model
```javascript
{
  type: enum [vehicle_offline, speeding, route_deviation, geofence_breach, shipment_delay, failed_delivery, maintenance_due, expired_license, expired_registration, low_fuel, long_stop],
  severity: enum [info, warning, critical],
  vehicle: ObjectId (ref: Vehicle),
  driver: ObjectId (ref: Driver),
  shipment: ObjectId (ref: Shipment),
  title: String,
  description: String,
  status: enum [unresolved, acknowledged, resolved],
  location: { latitude, longitude, address },
  resolvedAt: Date,
  resolvedBy: ObjectId (ref: User),
  notes: String
}
```

---

## 🔑 Authentication & Authorization

### JWT Token Structure
```javascript
{
  id: ObjectId,     // User ID
  iat: Number,      // Issued at
  exp: Number       // Expiration time
}
```

### User Roles & Permissions

| Role | Description | Permissions |
|------|-------------|-------------|
| **Super Admin** | Full system access | All operations |
| **Fleet Manager** | Fleet operations | Create/update vehicles, drivers, manage fleet |
| **Dispatcher** | Dispatch operations | Assign shipments, routes, update status |
| **Operations Manager** | Operations oversight | View metrics, approve deliveries |
| **Viewer** | Read-only access | View dashboards, reports |

### Protected Routes Example
```javascript
// Only super_admin can create users
router.post('/users', protect, authorize('super_admin'), createUser);

// fleet_manager and dispatcher can create shipments
router.post('/shipments', protect, authorize('fleet_manager', 'dispatcher'), createShipment);

// All authenticated users can view their data
router.get('/me', protect, getCurrentUser);
```

---

## 📡 Real-time Features (Socket.IO)

### Server Emits
```javascript
// Vehicle location update
socket.emit('vehicle:location', {
  vehicleId,
  latitude,
  longitude,
  speed,
  heading,
  timestamp,
  status
});

// Vehicle status change
socket.emit('vehicle:status-update', {
  vehicleId,
  status
});

// New shipment created
socket.emit('shipment:created', shipmentData);

// Shipment status changed
socket.emit('shipment:status-update', {
  shipmentId,
  status
});
```

### Client Can Join
```javascript
socket.emit('join-vehicle-tracking', vehicleId);
socket.emit('location-update', locationData);
```

---

## 📦 Dependencies

### Core
- **express** ^4.18.2 - Web framework
- **mongoose** ^7.5.0 - MongoDB ODM
- **socket.io** ^4.7.2 - Real-time communication
- **jsonwebtoken** ^9.0.2 - JWT authentication
- **bcryptjs** ^2.4.3 - Password hashing

### Additional
- **cors** ^2.8.5 - Cross-origin requests
- **helmet** ^7.0.0 - Security headers
- **express-validator** ^7.0.0 - Input validation
- **multer** ^1.4.5-lts.1 - File uploads
- **cloudinary** ^1.40.0 - Image storage
- **nodemailer** ^6.9.6 - Email notifications
- **dotenv** ^16.3.1 - Environment variables

---

## ⚠️ Troubleshooting

### Problem: "Cannot find module"
```bash
# Solution: Install dependencies
npm install
```

### Problem: "MONGO_URI is not defined"
```bash
# Solution: Create .env file and set MONGO_URI
echo "MONGO_URI=mongodb://localhost:27017/fleet-tracking" > .env
```

### Problem: "Port 5000 already in use"
```bash
# Solution: Change port in .env
echo "PORT=5001" >> .env

# OR kill the process (macOS/Linux)
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Problem: "MongoDB connection refused"
```bash
# Solution: Start MongoDB
mongod

# OR use MongoDB Atlas connection
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/fleet-tracking
```

### Problem: "JWT verification failed"
```bash
# Solution: Check JWT_SECRET is set in .env
echo "JWT_SECRET=your-secret-key" >> .env

# Restart server
npm run dev
```

---

## 📊 Project Timeline

| Day | Tasks | Status |
|-----|-------|--------|
| **Day 1** | Backend setup, models, APIs | ✅ DONE |
| **Day 2** | Frontend setup, API connection | ⏳ TODO |
| **Day 3** | Real-time tracking, live map | ⏳ TODO |
| **Day 4** | Dashboard, management UIs | ⏳ TODO |
| **Day 5** | Polish, testing, deployment | ⏳ TODO |

---

## 🚀 Deployment

### MongoDB Atlas Setup
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Add to `.env`: `MONGO_URI=mongodb+srv://...`

### Backend Deployment (Render)
1. Push code to GitHub
2. Connect GitHub to Render
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Deploy

---

## 📞 Support & Help

### Check Logs
```bash
# View server logs
npm run dev

# Check MongoDB
mongo
use fleet-tracking
db.users.find()
```

### Useful Commands
```bash
# Test API
curl http://localhost:5000/api/v1/health

# Seed database
node seeders/seedData.js

# Clear database
mongo
use fleet-tracking
db.dropDatabase()
```

---

## 📝 Notes

- All timestamps are in UTC
- Coordinates use lat/lng format
- Distances calculated using Haversine formula
- Location data auto-purges after 30 days
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 7 days

---

## ✅ Completion Checklist

- [ ] Node.js installed
- [ ] MongoDB installed or Atlas account created
- [ ] Project cloned
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with values
- [ ] Server starts without errors (`npm run dev`)
- [ ] Health check works (`curl http://localhost:5000/api/v1/health`)
- [ ] User signup works
- [ ] User login works
- [ ] Database seeding works (optional)
- [ ] All endpoints tested

**If all items checked, you're ready for Day 2!** 🎉

---

**Created:** September 6, 2026  
**Deadline:** September 11, 2026  
**Group:** Shaheer & Syed Najam Ul Hassan  
**Institution:** Capital University of Science & Technology (CUST)

---
