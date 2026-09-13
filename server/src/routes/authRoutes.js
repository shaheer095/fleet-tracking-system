import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateSignup, validateLogin } from '../middleware/validation.js';
import { successResponse, errorResponse } from '../utils/helpers.js';

const router = express.Router();

// @route   POST /api/v1/auth/signup
// @desc    Register a new user
router.post(
  '/signup',
  validateSignup,
  asyncHandler(async (req, res) => {
    const { name, email, password, role, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, 'A user with this email already exists');
    }

    const user = await User.create({ name, email, password, role, phone });

    const token = user.getSignedJwtToken();

    return successResponse(
      res,
      201,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      'User registered successfully'
    );
  })
);

// @route   POST /api/v1/auth/login
// @desc    Login a user
router.post(
  '/login',
  validateLogin,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    if (!user.isActive) {
      return errorResponse(res, 403, 'This account has been deactivated');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = user.getSignedJwtToken();

    return successResponse(
      res,
      200,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      'Login successful'
    );
  })
);

// @route   GET /api/v1/auth/me
// @desc    Get the currently logged-in user
router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    return successResponse(res, 200, req.user, 'Current user fetched');
  })
);

export default router;
