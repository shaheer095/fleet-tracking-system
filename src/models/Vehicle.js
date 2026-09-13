import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ['truck', 'van', 'container_truck', 'pickup', 'refrigerated_truck'],
      required: true,
    },
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      comment: 'Capacity in kg',
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'hybrid', 'electric'],
      default: 'diesel',
    },
    status: {
      type: String,
      enum: ['available', 'in_transit', 'idle', 'maintenance', 'offline', 'inactive'],
      default: 'available',
    },
    currentLocation: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      address: { type: String, default: '' },
      lastUpdated: { type: Date, default: null },
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
    },
    insuranceExpiry: {
      type: Date,
    },
    registrationExpiry: {
      type: Date,
    },
    speedLimit: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

vehicleSchema.index({ 'currentLocation.latitude': 1, 'currentLocation.longitude': 1 });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
