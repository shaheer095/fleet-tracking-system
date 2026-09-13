// General helper utilities

/**
 * Generate a unique ID with a prefix, e.g. generateId('V') -> 'V-1725713200123-482'
 */
export const generateId = (prefix = 'ID') => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Generate a tracking number for shipments, e.g. TRK-20260907-4821
 */
export const generateTrackingNumber = () => {
  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
    date.getDate()
  ).padStart(2, '0')}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TRK-${datePart}-${random}`;
};

/**
 * Calculate distance in km between two lat/lng points using the Haversine formula
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
};

/**
 * Estimate travel duration in minutes given distance (km) and average speed (km/h)
 */
export const estimateDuration = (distanceKm, avgSpeedKmh = 50) => {
  if (!distanceKm || avgSpeedKmh <= 0) return 0;
  return Math.round((distanceKm / avgSpeedKmh) * 60);
};

/**
 * Standard success response shape
 */
export const successResponse = (res, statusCode, data, message = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standard error response shape
 */
export const errorResponse = (res, statusCode, message = 'Something went wrong') => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

/**
 * Paginate a Mongoose query
 */
export const paginate = (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Remove undefined/null keys from an object (useful for PATCH/update payloads)
 */
export const cleanObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== null)
  );
};

/**
 * Sleep helper (useful for seeders/testing)
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Pick a random element from an array (used by seeders)
 */
export const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Random number between min and max (inclusive)
 */
export const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
