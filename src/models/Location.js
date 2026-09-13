import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  speed: {
    type: Number,
    default: 0,
    comment: 'km/h',
  },
  heading: {
    type: Number,
    default: 0,
    comment: 'degrees, 0-360',
  },
  accuracy: {
    type: Number,
    default: 0,
    comment: 'meters',
  },
  altitude: {
    type: Number,
    default: 0,
    comment: 'meters',
  },
  ignitionStatus: {
    type: Boolean,
    default: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    // Auto-expire location history after 30 days
    expires: 60 * 60 * 24 * 30,
  },
});

locationSchema.index({ vehicleId: 1, timestamp: -1 });

const Location = mongoose.model('Location', locationSchema);

export default Location;
