import mongoose from 'mongoose';

const stopSchema = new mongoose.Schema(
  {
    stopNumber: { type: Number, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, default: '' },
    stopType: {
      type: String,
      enum: ['pickup', 'delivery', 'waypoint', 'rest'],
      default: 'waypoint',
    },
  },
  { _id: false }
);

const routeSchema = new mongoose.Schema(
  {
    routeId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    origin: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, default: '' },
    },
    destination: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, default: '' },
    },
    stops: [stopSchema],
    totalDistance: {
      type: Number,
      default: 0,
      comment: 'km',
    },
    estimatedDuration: {
      type: Number,
      default: 0,
      comment: 'minutes',
    },
    actualDuration: {
      type: Number,
      default: 0,
    },
    trafficStatus: {
      type: String,
      enum: ['clear', 'moderate', 'heavy', 'unknown'],
      default: 'unknown',
    },
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null,
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
    },
    shipments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment',
      },
    ],
    status: {
      type: String,
      enum: ['planned', 'in_progress', 'completed', 'cancelled'],
      default: 'planned',
    },
  },
  { timestamps: true }
);

const Route = mongoose.model('Route', routeSchema);

export default Route;
