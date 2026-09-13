import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from '../src/models/User.js';
import Vehicle from '../src/models/Vehicle.js';
import Driver from '../src/models/Driver.js';
import Shipment from '../src/models/Shipment.js';
import Route from '../src/models/Route.js';
import Alert from '../src/models/Alert.js';
import { generateId, generateTrackingNumber } from '../src/utils/helpers.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🗄️  Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Vehicle.deleteMany({}),
      Driver.deleteMany({}),
      Shipment.deleteMany({}),
      Route.deleteMany({}),
      Alert.deleteMany({}),
    ]);
    console.log('🧹 Cleared existing collections');

    // ---- Users ----
    const users = await User.create([
      { name: 'Super Admin', email: 'admin@fleet.com', password: 'password123', role: 'super_admin' },
      { name: 'Fleet Manager', email: 'manager@fleet.com', password: 'password123', role: 'fleet_manager' },
      { name: 'Dispatcher', email: 'dispatcher@fleet.com', password: 'password123', role: 'dispatcher' },
      { name: 'Operations Manager', email: 'ops@fleet.com', password: 'password123', role: 'operations_manager' },
    ]);
    console.log(`👥 Created ${users.length} users`);

    // ---- Drivers ----
    const drivers = await Driver.create([
      {
        driverId: generateId('D'),
        name: 'Ahmed Khan',
        email: 'ahmed.khan@fleet.com',
        phone: '+92-300-1234567',
        licenseNumber: 'LIC-001',
        licenseExpiry: new Date('2027-06-30'),
        experience: 5,
        status: 'available',
      },
      {
        driverId: generateId('D'),
        name: 'Bilal Ahmed',
        email: 'bilal.ahmed@fleet.com',
        phone: '+92-300-2345678',
        licenseNumber: 'LIC-002',
        licenseExpiry: new Date('2026-12-31'),
        experience: 3,
        status: 'on_duty',
      },
      {
        driverId: generateId('D'),
        name: 'Usman Ali',
        email: 'usman.ali@fleet.com',
        phone: '+92-300-3456789',
        licenseNumber: 'LIC-003',
        licenseExpiry: new Date('2028-03-15'),
        experience: 7,
        status: 'available',
      },
    ]);
    console.log(`👨‍✈️ Created ${drivers.length} drivers`);

    // ---- Vehicles ----
    const vehicles = await Vehicle.create([
      {
        vehicleId: generateId('V'),
        registrationNumber: 'ABC-1234',
        type: 'truck',
        make: 'Hino',
        model: '500',
        year: 2023,
        capacity: 5000,
        fuelType: 'diesel',
        status: 'available',
        currentLocation: { latitude: 33.6844, longitude: 73.0479, address: 'Islamabad', lastUpdated: new Date() },
        assignedDriver: drivers[0]._id,
      },
      {
        vehicleId: generateId('V'),
        registrationNumber: 'XYZ-5678',
        type: 'van',
        make: 'Toyota',
        model: 'HiAce',
        year: 2022,
        capacity: 1500,
        fuelType: 'petrol',
        status: 'in_transit',
        currentLocation: { latitude: 31.5497, longitude: 74.3436, address: 'Lahore', lastUpdated: new Date() },
        assignedDriver: drivers[1]._id,
      },
      {
        vehicleId: generateId('V'),
        registrationNumber: 'DEF-9012',
        type: 'refrigerated_truck',
        make: 'Isuzu',
        model: 'NPR',
        year: 2024,
        capacity: 3500,
        fuelType: 'diesel',
        status: 'idle',
        currentLocation: { latitude: 24.8607, longitude: 67.0011, address: 'Karachi', lastUpdated: new Date() },
      },
    ]);
    console.log(`🚗 Created ${vehicles.length} vehicles`);

    // Link drivers back to their assigned vehicles
    drivers[0].assignedVehicle = vehicles[0]._id;
    drivers[1].assignedVehicle = vehicles[1]._id;
    await drivers[0].save();
    await drivers[1].save();

    // ---- Route ----
    const route = await Route.create({
      routeId: generateId('R'),
      name: 'Islamabad to Lahore Express',
      origin: { latitude: 33.6844, longitude: 73.0479, address: 'Islamabad' },
      destination: { latitude: 31.5497, longitude: 74.3436, address: 'Lahore' },
      stops: [
        { stopNumber: 1, latitude: 32.9, longitude: 73.5, address: 'Gujranwala Rest Stop', stopType: 'rest' },
      ],
      totalDistance: 375,
      estimatedDuration: 270,
      trafficStatus: 'moderate',
      assignedVehicle: vehicles[0]._id,
      assignedDriver: drivers[0]._id,
      status: 'planned',
    });
    console.log('🛣️  Created 1 route');

    // ---- Shipments ----
    const shipments = await Shipment.create([
      {
        shipmentId: generateId('SHP'),
        trackingNumber: generateTrackingNumber(),
        customer: { name: 'Zain Traders', email: 'zain@example.com', phone: '+92-333-1111111', address: 'Lahore' },
        pickupLocation: { latitude: 33.6844, longitude: 73.0479, address: 'Islamabad Warehouse' },
        deliveryLocation: { latitude: 31.5497, longitude: 74.3436, address: 'Lahore Distribution Center' },
        packageDetails: { description: 'Electronics shipment', weight: 250, quantity: 10 },
        assignedVehicle: vehicles[0]._id,
        assignedDriver: drivers[0]._id,
        assignedRoute: route._id,
        status: 'in_transit',
        priority: 'high',
        expectedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
      {
        shipmentId: generateId('SHP'),
        trackingNumber: generateTrackingNumber(),
        customer: { name: 'Karachi Textiles', email: 'kt@example.com', phone: '+92-333-2222222', address: 'Karachi' },
        pickupLocation: { latitude: 24.8607, longitude: 67.0011, address: 'Karachi Port' },
        deliveryLocation: { latitude: 24.9, longitude: 67.05, address: 'Karachi Industrial Area' },
        packageDetails: { description: 'Textile rolls', weight: 800, quantity: 40 },
        status: 'created',
        priority: 'normal',
        expectedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 48),
      },
      {
        shipmentId: generateId('SHP'),
        trackingNumber: generateTrackingNumber(),
        customer: { name: 'Faisal Movers', email: 'faisal@example.com', phone: '+92-333-3333333', address: 'Rawalpindi' },
        pickupLocation: { latitude: 33.6, longitude: 73.05, address: 'Rawalpindi Depot' },
        deliveryLocation: { latitude: 33.7, longitude: 73.15, address: 'Islamabad Sector F-10' },
        packageDetails: { description: 'Household furniture', weight: 400, quantity: 5 },
        assignedVehicle: vehicles[1]._id,
        assignedDriver: drivers[1]._id,
        status: 'out_for_delivery',
        priority: 'urgent',
        expectedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 6),
      },
    ]);
    console.log(`📦 Created ${shipments.length} shipments`);

    // ---- Alerts ----
    const alerts = await Alert.create([
      {
        type: 'speeding',
        severity: 'warning',
        vehicle: vehicles[1]._id,
        driver: drivers[1]._id,
        title: 'Speeding detected',
        description: 'Vehicle XYZ-5678 exceeded the speed limit on GT Road',
        status: 'unresolved',
        location: { latitude: 32.0, longitude: 73.8, address: 'GT Road' },
      },
      {
        type: 'maintenance_due',
        severity: 'info',
        vehicle: vehicles[2]._id,
        title: 'Maintenance due',
        description: 'Vehicle DEF-9012 is due for scheduled maintenance',
        status: 'unresolved',
      },
    ]);
    console.log(`🔔 Created ${alerts.length} alerts`);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Test login credentials (all use password: password123):');
    users.forEach((u) => console.log(`  - ${u.role}: ${u.email}`));

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
