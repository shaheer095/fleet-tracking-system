import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema(
  {
    shipmentId: {
      type: String,
      required: true,
      unique: true,
    },
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, default: '' },
      phone: { type: String, required: true },
      address: { type: String, default: '' },
    },
    pickupLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, default: '' },
    },
    deliveryLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, default: '' },
    },
    packageDetails: {
      description: { type: String, required: true },
      weight: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
      dimensions: {
        length: { type: Number, default: 0 },
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
      },
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
    assignedRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      default: null,
    },
    status: {
      type: String,
      enum: [
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
      ],
      default: 'created',
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
    },
    expectedDelivery: {
      type: Date,
    },
    actualDelivery: {
      type: Date,
    },
    location: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      address: { type: String, default: '' },
      lastUpdated: { type: Date, default: null },
    },
    deliveryAttempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Shipment = mongoose.model('Shipment', shipmentSchema);

export default Shipment;
