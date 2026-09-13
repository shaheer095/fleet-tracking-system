import { body, validationResult } from 'express-validator';
import {
  VEHICLE_TYPES,
  FUEL_TYPES,
  VEHICLE_STATUSES,
  DRIVER_STATUSES,
  SHIPMENT_STATUSES,
  SHIPMENT_PRIORITIES,
  USER_ROLES,
  ALERT_TYPES,
  ALERT_SEVERITIES,
} from '../utils/validators.js';

/**
 * Runs after any validation chain array below - collects errors into a
 * consistent 400 response. Attach as the last item in a route's middleware list.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ---------- Auth ----------
export const validateSignup = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(USER_ROLES).withMessage('Invalid role'),
  validate,
];

export const validateLogin = [
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// ---------- Users ----------
export const validateUser = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('A valid email is required'),
  body('role').optional().isIn(USER_ROLES).withMessage('Invalid role'),
  body('phone').optional().isString(),
  validate,
];

// ---------- Vehicles ----------
export const validateVehicle = [
  body('vehicleId').notEmpty().withMessage('vehicleId is required'),
  body('registrationNumber').notEmpty().withMessage('registrationNumber is required'),
  body('type').isIn(VEHICLE_TYPES).withMessage(`type must be one of: ${VEHICLE_TYPES.join(', ')}`),
  body('make').notEmpty().withMessage('make is required'),
  body('model').notEmpty().withMessage('model is required'),
  body('year').isInt({ min: 1990 }).withMessage('year must be a valid year'),
  body('capacity').isNumeric().withMessage('capacity must be a number'),
  body('fuelType').optional().isIn(FUEL_TYPES).withMessage(`fuelType must be one of: ${FUEL_TYPES.join(', ')}`),
  validate,
];

export const validateVehicleStatus = [
  body('status').isIn(VEHICLE_STATUSES).withMessage(`status must be one of: ${VEHICLE_STATUSES.join(', ')}`),
  validate,
];

// ---------- Drivers ----------
export const validateDriver = [
  body('name').notEmpty().withMessage('name is required'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('phone').notEmpty().withMessage('phone is required'),
  body('licenseNumber').notEmpty().withMessage('licenseNumber is required'),
  body('licenseExpiry').isISO8601().withMessage('licenseExpiry must be a valid date'),
  body('status').optional().isIn(DRIVER_STATUSES).withMessage(`status must be one of: ${DRIVER_STATUSES.join(', ')}`),
  validate,
];

// ---------- Shipments ----------
export const validateShipment = [
  body('customer.name').notEmpty().withMessage('customer.name is required'),
  body('customer.phone').notEmpty().withMessage('customer.phone is required'),
  body('pickupLocation.latitude').isFloat({ min: -90, max: 90 }).withMessage('pickupLocation.latitude is invalid'),
  body('pickupLocation.longitude').isFloat({ min: -180, max: 180 }).withMessage('pickupLocation.longitude is invalid'),
  body('deliveryLocation.latitude').isFloat({ min: -90, max: 90 }).withMessage('deliveryLocation.latitude is invalid'),
  body('deliveryLocation.longitude').isFloat({ min: -180, max: 180 }).withMessage('deliveryLocation.longitude is invalid'),
  body('packageDetails.description').notEmpty().withMessage('packageDetails.description is required'),
  body('packageDetails.weight').isNumeric().withMessage('packageDetails.weight must be a number'),
  body('priority').optional().isIn(SHIPMENT_PRIORITIES).withMessage(`priority must be one of: ${SHIPMENT_PRIORITIES.join(', ')}`),
  validate,
];

export const validateShipmentStatus = [
  body('status').isIn(SHIPMENT_STATUSES).withMessage(`status must be one of: ${SHIPMENT_STATUSES.join(', ')}`),
  validate,
];

// ---------- Locations ----------
export const validateLocation = [
  body('vehicleId').notEmpty().withMessage('vehicleId is required'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('latitude must be between -90 and 90'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('longitude must be between -180 and 180'),
  body('speed').optional().isNumeric().withMessage('speed must be a number'),
  body('heading').optional().isNumeric().withMessage('heading must be a number'),
  body('ignitionStatus').optional().isBoolean().withMessage('ignitionStatus must be a boolean'),
  validate,
];

// ---------- Alerts ----------
export const validateAlert = [
  body('type').isIn(ALERT_TYPES).withMessage(`type must be one of: ${ALERT_TYPES.join(', ')}`),
  body('severity').isIn(ALERT_SEVERITIES).withMessage(`severity must be one of: ${ALERT_SEVERITIES.join(', ')}`),
  body('title').notEmpty().withMessage('title is required'),
  body('description').notEmpty().withMessage('description is required'),
  validate,
];
