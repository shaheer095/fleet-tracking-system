import express from 'express';
import Shipment from '../models/Shipment.js';
import '../models/Route.js'; // registers the Route schema so populate('assignedRoute') works
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateShipment, validateShipmentStatus } from '../middleware/validation.js';
import { successResponse, errorResponse, paginate, generateId, generateTrackingNumber } from '../utils/helpers.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/v1/shipments
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = paginate(req.query);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const [shipments, total] = await Promise.all([
      Shipment.find(filter)
        .populate('assignedVehicle', 'vehicleId registrationNumber')
        .populate('assignedDriver', 'name driverId phone')
        .populate('assignedRoute', 'routeId name')
        .skip(skip)
        .limit(limit)
        .sort('-createdAt'),
      Shipment.countDocuments(filter),
    ]);
    return successResponse(res, 200, { shipments, total, page, limit }, 'Shipments fetched');
  })
);

// @route   GET /api/v1/shipments/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const shipment = await Shipment.findById(req.params.id)
      .populate('assignedVehicle')
      .populate('assignedDriver')
      .populate('assignedRoute');
    if (!shipment) return errorResponse(res, 404, 'Shipment not found');
    return successResponse(res, 200, shipment, 'Shipment fetched');
  })
);

// @route   POST /api/v1/shipments
router.post(
  '/',
  authorize('super_admin', 'fleet_manager', 'dispatcher'),
  validateShipment,
  asyncHandler(async (req, res) => {
    const shipmentId = req.body.shipmentId || generateId('SHP');
    const trackingNumber = req.body.trackingNumber || generateTrackingNumber();

    const shipment = await Shipment.create({ ...req.body, shipmentId, trackingNumber });

    const io = req.app.get('io');
    if (io) io.emit('shipment:created', shipment);

    return successResponse(res, 201, shipment, 'Shipment created');
  })
);

// @route   PATCH /api/v1/shipments/:id/status
router.patch(
  '/:id/status',
  authorize('super_admin', 'fleet_manager', 'dispatcher', 'operations_manager'),
  validateShipmentStatus,
  asyncHandler(async (req, res) => {
    const update = { status: req.body.status };
    if (req.body.status === 'delivered') update.actualDelivery = new Date();

    const shipment = await Shipment.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!shipment) return errorResponse(res, 404, 'Shipment not found');

    const io = req.app.get('io');
    if (io) io.emit('shipment:status-update', { shipmentId: shipment._id, status: shipment.status });

    return successResponse(res, 200, shipment, 'Shipment status updated');
  })
);

// @route   PATCH /api/v1/shipments/:id/assign
router.patch(
  '/:id/assign',
  authorize('super_admin', 'fleet_manager', 'dispatcher'),
  asyncHandler(async (req, res) => {
    const { vehicleId, driverId, routeId } = req.body;
    const update = { status: 'assigned' };
    if (vehicleId) update.assignedVehicle = vehicleId;
    if (driverId) update.assignedDriver = driverId;
    if (routeId) update.assignedRoute = routeId;

    const shipment = await Shipment.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    })
      .populate('assignedVehicle')
      .populate('assignedDriver')
      .populate('assignedRoute');

    if (!shipment) return errorResponse(res, 404, 'Shipment not found');
    return successResponse(res, 200, shipment, 'Shipment assigned');
  })
);

export default router;