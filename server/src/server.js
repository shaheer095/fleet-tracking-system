import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import shipmentRoutes from './routes/shipmentRoutes.js';
import trackingRoutes from './routes/trackingRoutes.js';
import locationRoutes from './routes/locationRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Make io accessible in route handlers via req.app.get('io')
app.set('io', io);

// Global middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Fleet Tracking API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/drivers', driverRoutes);
app.use('/api/v1/shipments', shipmentRoutes);
app.use('/api/v1/tracking', trackingRoutes);
app.use('/api/v1/locations', locationRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on('join-vehicle-tracking', (vehicleId) => {
    socket.join(`vehicle:${vehicleId}`);
    console.log(`Socket ${socket.id} joined tracking room for vehicle ${vehicleId}`);
  });

  socket.on('location-update', (locationData) => {
    // Broadcast to anyone tracking this vehicle specifically
    if (locationData?.vehicleId) {
      socket.to(`vehicle:${locationData.vehicleId}`).emit('vehicle:location', locationData);
    }
    // Also broadcast globally for dashboard views
    socket.broadcast.emit('vehicle:location', locationData);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// 404 + error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log('🚀 Fleet Tracking Server running on port ' + PORT);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('🗄️  Database: MongoDB');
  console.log('🔌 WebSocket enabled for real-time tracking');
});

export default app;
