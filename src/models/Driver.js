import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    driverId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    licenseExpiry: {
      type: Date,
      required: true,
    },
    experience: {
      type: Number,
      default: 0,
      comment: 'Years of experience',
    },
    status: {
      type: String,
      enum: ['available', 'on_duty', 'off_duty', 'on_delivery', 'suspended'],
      default: 'available',
    },
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null,
    },
    currentLocation: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      address: { type: String, default: '' },
      lastUpdated: { type: Date, default: null },
    },
    totalTrips: {
      type: Number,
      default: 0,
    },
    completedDeliveries: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 5,
    },
    profileImage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Driver = mongoose.model('Driver', driverSchema);

export default Driver;
