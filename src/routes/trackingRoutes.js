import express from 'express';
import Vehicle from '../models/Vehicle.js';
import Location from '../models/Location.js';
import Shipment from '../models/Shipment.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse, errorResponse, paginate } from '../utils/helpers.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/v1/tracking/vehicles
// @desc    Get all vehicle current locations
router.get(
  '/vehicles',
  asyncHandler(async (req, res) => {
    const vehicles = await Vehicle.find(
      {},
      'vehicleId registrationNumber status currentLocation assignedDriver'
    ).populate('assignedDriver', 'name driverId');
    return successResponse(res, 200, vehicles, 'Vehicle locations fetched');
  })
);

// @route   GET /api/v1/tracking/vehicles/:id
// @desc    Get a single vehicle's current location
router.get(
  '/vehicles/:id',
  asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id, 'vehicleId registrationNumber status currentLocation');
    if (!vehicle) return errorResponse(res, 404, 'Vehicle not found');
    return successResponse(res, 200, vehicle, 'Vehicle location fetched');
  })
);

// @route   GET /api/v1/tracking/history/:vehicleId
// @desc    Get GPS location history for a vehicle
router.get(
  '/history/:vehicleId',
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = paginate(req.query);
    const [history, total] = await Promise.all([
      Location.find({ vehicleId: req.params.vehicleId }).sort('-timestamp').skip(skip).limit(limit),
      Location.countDocuments({ vehicleId: req.params.vehicleId }),
    ]);
    return successResponse(res, 200, { history, total, page, limit }, 'Location history fetched');
  })
);

// @route   GET /api/v1/tracking/shipments/:id
// @desc    Track a shipment's current status and location
router.get(
  '/shipments/:id',
  asyncHandler(async (req, res) => {
    const shipment = await Shipment.findById(req.params.id, 'shipmentId trackingNumber status location expectedDelivery')
      .populate('assignedVehicle', 'vehicleId currentLocation')
      .populate('assignedDriver', 'name phone');
    if (!shipment) return errorResponse(res, 404, 'Shipment not found');
    return successResponse(res, 200, shipment, 'Shipment tracking info fetched');
  })
);

export default router;
