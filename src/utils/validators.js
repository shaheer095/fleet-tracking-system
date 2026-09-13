// Standalone validation helpers (used by middleware/validation.js and models)

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && regex.test(email);
};

export const isValidPhone = (phone) => {
  const regex = /^[+]?[\d\s-]{7,15}$/;
  return typeof phone === 'string' && regex.test(phone);
};

export const isValidLatitude = (lat) => {
  const n = Number(lat);
  return !Number.isNaN(n) && n >= -90 && n <= 90;
};

export const isValidLongitude = (lng) => {
  const n = Number(lng);
  return !Number.isNaN(n) && n >= -180 && n <= 180;
};

export const isValidCoordinates = (lat, lng) => isValidLatitude(lat) && isValidLongitude(lng);

export const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

export const isPositiveNumber = (value) => typeof value === 'number' && value > 0;

export const isValidEnum = (value, allowed = []) => allowed.includes(value);

export const isValidPassword = (password) => {
  // At least 6 characters
  return typeof password === 'string' && password.length >= 6;
};

export const isValidYear = (year) => {
  const n = Number(year);
  const currentYear = new Date().getFullYear();
  return Number.isInteger(n) && n >= 1990 && n <= currentYear + 1;
};

export const isValidObjectIdString = (id) => {
  return typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);
};

export const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !Number.isNaN(d.getTime());
};

export const VEHICLE_TYPES = ['truck', 'van', 'container_truck', 'pickup', 'refrigerated_truck'];
export const FUEL_TYPES = ['petrol', 'diesel', 'hybrid', 'electric'];
export const VEHICLE_STATUSES = ['available', 'in_transit', 'idle', 'maintenance', 'offline', 'inactive'];
export const DRIVER_STATUSES = ['available', 'on_duty', 'off_duty', 'on_delivery', 'suspended'];
export const SHIPMENT_STATUSES = [
  'created',
  'assigned',
  'picked_up',
  'in_transit',
  'at_destination',
  'out_for_delivery',
  'delivered',
  'delayed',
  'cancelled',
  'failed',
];
export const SHIPMENT_PRIORITIES = ['low', 'normal', 'high', 'urgent'];
export const USER_ROLES = ['super_admin', 'fleet_manager', 'dispatcher', 'operations_manager', 'viewer'];
export const ROUTE_STATUSES = ['planned', 'in_progress', 'completed', 'cancelled'];
export const TRAFFIC_STATUSES = ['clear', 'moderate', 'heavy', 'unknown'];
export const ALERT_TYPES = [
  'vehicle_offline',
  'speeding',
  'route_deviation',
  'geofence_breach',
  'shipment_delay',
  'failed_delivery',
  'maintenance_due',
  'expired_license',
  'expired_registration',
  'low_fuel',
  'long_stop',
];
export const ALERT_SEVERITIES = ['info', 'warning', 'critical'];
export const ALERT_STATUSES = ['unresolved', 'acknowledged', 'resolved'];
