import express from 'express';
import Location from '../models/Location.js';
import Vehicle from '../models/Vehicle.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateLocation } from '../middleware/validation.js';
import { successResponse, errorResponse, paginate } from '../utils/helpers.js';

const router = express.Router();

router.use(protect);

// @route   POST /api/v1/locations
// @desc    Record a new GPS location update for a vehicle
router.post(
  '/',
  validateLocation,
  asyncHandler(async (req, res) => {
    const { vehicleId, latitude, longitude, speed, heading, accuracy, altitude, ignitionStatus } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return errorResponse(res, 404, 'Vehicle not found');

    const location = await Location.create({
      vehicleId,
      latitude,
      longitude,
      speed,
      heading,
      accuracy,
      altitude,
      ignitionStatus,
    });

    vehicle.currentLocation = {
      latitude,
      longitude,
      address: vehicle.currentLocation?.address || '',
      lastUpdated: new Date(),
    };
    await vehicle.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('vehicle:location', {
        vehicleId: vehicle._id,
        latitude,
        longitude,
        speed,
        heading,
        timestamp: location.timestamp,
        status: vehicle.status,
      });
    }

    return successResponse(res, 201, location, 'Location recorded');
  })
);

// @route   GET /api/v1/locations/:vehicleId
// @desc    Get the latest known location for a vehicle
router.get(
  '/:vehicleId',
  asyncHandler(async (req, res) => {
    const location = await Location.findOne({ vehicleId: req.params.vehicleId }).sort('-timestamp');
    if (!location) return errorResponse(res, 404, 'No location data found for this vehicle');
    return successResponse(res, 200, location, 'Latest location fetched');
  })
);

// @route   GET /api/v1/locations/:vehicleId/history
// @desc    Get GPS location history for a vehicle
router.get(
  '/:vehicleId/history',
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = paginate(req.query);
    const [history, total] = await Promise.all([
      Location.find({ vehicleId: req.params.vehicleId }).sort('-timestamp').skip(skip).limit(limit),
      Location.countDocuments({ vehicleId: req.params.vehicleId }),
    ]);
    return successResponse(res, 200, { history, total, page, limit }, 'Location history fetched');
  })
);

export default router;
