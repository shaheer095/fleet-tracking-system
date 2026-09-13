import express from 'express';
import Driver from '../models/Driver.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateDriver } from '../middleware/validation.js';
import { successResponse, errorResponse, paginate, generateId } from '../utils/helpers.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/v1/drivers
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = paginate(req.query);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [drivers, total] = await Promise.all([
      Driver.find(filter).populate('assignedVehicle', 'vehicleId registrationNumber').skip(skip).limit(limit).sort('-createdAt'),
      Driver.countDocuments(filter),
    ]);
    return successResponse(res, 200, { drivers, total, page, limit }, 'Drivers fetched');
  })
);

// @route   GET /api/v1/drivers/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.params.id).populate('assignedVehicle');
    if (!driver) return errorResponse(res, 404, 'Driver not found');
    return successResponse(res, 200, driver, 'Driver fetched');
  })
);

// @route   POST /api/v1/drivers
router.post(
  '/',
  authorize('super_admin', 'fleet_manager'),
  validateDriver,
  asyncHandler(async (req, res) => {
    const driverId = req.body.driverId || generateId('D');
    const driver = await Driver.create({ ...req.body, driverId });
    return successResponse(res, 201, driver, 'Driver created');
  })
);

// @route   PUT /api/v1/drivers/:id
router.put(
  '/:id',
  authorize('super_admin', 'fleet_manager'),
  asyncHandler(async (req, res) => {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!driver) return errorResponse(res, 404, 'Driver not found');
    return successResponse(res, 200, driver, 'Driver updated');
  })
);

// @route   DELETE /api/v1/drivers/:id
router.delete(
  '/:id',
  authorize('super_admin', 'fleet_manager'),
  asyncHandler(async (req, res) => {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return errorResponse(res, 404, 'Driver not found');
    return successResponse(res, 200, null, 'Driver deleted');
  })
);

export default router;
