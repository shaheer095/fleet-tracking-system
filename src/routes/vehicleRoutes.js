import express from 'express';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateVehicle, validateVehicleStatus } from '../middleware/validation.js';
import { successResponse, errorResponse, paginate } from '../utils/helpers.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/v1/vehicles
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = paginate(req.query);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;

    const [vehicles, total] = await Promise.all([
      Vehicle.find(filter).populate('assignedDriver', 'name driverId phone').skip(skip).limit(limit).sort('-createdAt'),
      Vehicle.countDocuments(filter),
    ]);
    return successResponse(res, 200, { vehicles, total, page, limit }, 'Vehicles fetched');
  })
);

// @route   GET /api/v1/vehicles/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id).populate('assignedDriver');
    if (!vehicle) return errorResponse(res, 404, 'Vehicle not found');
    return successResponse(res, 200, vehicle, 'Vehicle fetched');
  })
);

// @route   POST /api/v1/vehicles
router.post(
  '/',
  authorize('super_admin', 'fleet_manager'),
  validateVehicle,
  asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.create(req.body);
    return successResponse(res, 201, vehicle, 'Vehicle created');
  })
);

// @route   PUT /api/v1/vehicles/:id
router.put(
  '/:id',
  authorize('super_admin', 'fleet_manager'),
  asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vehicle) return errorResponse(res, 404, 'Vehicle not found');
    return successResponse(res, 200, vehicle, 'Vehicle updated');
  })
);

// @route   PATCH /api/v1/vehicles/:id/status
router.patch(
  '/:id/status',
  authorize('super_admin', 'fleet_manager', 'dispatcher'),
  validateVehicleStatus,
  asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!vehicle) return errorResponse(res, 404, 'Vehicle not found');

    const io = req.app.get('io');
    if (io) io.emit('vehicle:status-update', { vehicleId: vehicle._id, status: vehicle.status });

    return successResponse(res, 200, vehicle, 'Vehicle status updated');
  })
);

// @route   PATCH /api/v1/vehicles/:id/assign-driver
router.patch(
  '/:id/assign-driver',
  authorize('super_admin', 'fleet_manager', 'dispatcher'),
  asyncHandler(async (req, res) => {
    const { driverId } = req.body;
    if (!driverId) return errorResponse(res, 400, 'driverId is required');

    const driver = await Driver.findById(driverId);
    if (!driver) return errorResponse(res, 404, 'Driver not found');

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { assignedDriver: driverId },
      { new: true, runValidators: true }
    ).populate('assignedDriver');
    if (!vehicle) return errorResponse(res, 404, 'Vehicle not found');

    driver.assignedVehicle = vehicle._id;
    await driver.save();

    return successResponse(res, 200, vehicle, 'Driver assigned to vehicle');
  })
);

// @route   DELETE /api/v1/vehicles/:id
router.delete(
  '/:id',
  authorize('super_admin', 'fleet_manager'),
  asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return errorResponse(res, 404, 'Vehicle not found');
    return successResponse(res, 200, null, 'Vehicle deleted');
  })
);

export default router;
