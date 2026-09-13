import express from 'express';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateSignup, validateUser } from '../middleware/validation.js';
import { successResponse, errorResponse, paginate } from '../utils/helpers.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/v1/users
router.get(
  '/',
  authorize('super_admin', 'fleet_manager'),
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = paginate(req.query);
    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).sort('-createdAt'),
      User.countDocuments(),
    ]);
    return successResponse(res, 200, { users, total, page, limit }, 'Users fetched');
  })
);

// @route   GET /api/v1/users/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 404, 'User not found');
    return successResponse(res, 200, user, 'User fetched');
  })
);

// @route   POST /api/v1/users
router.post(
  '/',
  authorize('super_admin'),
  validateSignup,
  asyncHandler(async (req, res) => {
    const user = await User.create(req.body);
    return successResponse(res, 201, user, 'User created');
  })
);

// @route   PUT /api/v1/users/:id
router.put(
  '/:id',
  authorize('super_admin'),
  validateUser,
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return errorResponse(res, 404, 'User not found');
    return successResponse(res, 200, user, 'User updated');
  })
);

// @route   DELETE /api/v1/users/:id
router.delete(
  '/:id',
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return errorResponse(res, 404, 'User not found');
    return successResponse(res, 200, null, 'User deleted');
  })
);

export default router;
