/**
 * Simulates GPS devices for the seeded vehicles by periodically POSTing
 * location updates to the real backend API (not a shortcut into the DB).
 * This exercises the full real pipeline: API -> MongoDB -> Socket.IO -> frontend map.
 *
 * Usage: npm run simulate
 */
import dotenv from 'dotenv';
dotenv.config();

const API_URL = `http://localhost:${process.env.PORT || 5000}/api/v1`;
const EMAIL = 'admin@fleet.com';
const PASSWORD = 'password123';
const INTERVAL_MS = 3000;

let token = null;

const login = async () => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const data = await res.json();
  if (!data.success) throw new Error('Simulator login failed: ' + data.message);
  return data.data.token;
};

const getVehicles = async () => {
  const res = await fetch(`${API_URL}/vehicles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.data.vehicles;
};

const postLocation = async (vehicleId, latitude, longitude, speed, heading) => {
  const res = await fetch(`${API_URL}/locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      vehicleId,
      latitude,
      longitude,
      speed,
      heading,
      ignitionStatus: true,
    }),
  });
  return res.json();
};

// Small random walk so vehicles drift realistically instead of teleporting
const step = (state) => {
  const angle = (state.heading + (Math.random() * 40 - 20) + 360) % 360;
  const rad = (angle * Math.PI) / 180;
  const distanceKm = (state.speed / 3600) * (INTERVAL_MS / 1000); // km moved this tick
  const dLat = (distanceKm / 111) * Math.cos(rad);
  const dLng = (distanceKm / (111 * Math.cos((state.lat * Math.PI) / 180))) * Math.sin(rad);

  return {
    lat: state.lat + dLat,
    lng: state.lng + dLng,
    heading: angle,
    speed: Math.max(20, Math.min(90, state.speed + (Math.random() * 10 - 5))),
  };
};

const run = async () => {
  console.log('🛰️  Location simulator starting...');
  token = await login();
  console.log('✅ Logged in as', EMAIL);

  const vehicles = await getVehicles();
  if (!vehicles.length) {
    console.log('No vehicles found. Run "npm run seed" first.');
    process.exit(1);
  }

  const states = new Map();
  vehicles.forEach((v) => {
    states.set(v._id, {
      lat: v.currentLocation?.latitude ?? 33.6844,
      lng: v.currentLocation?.longitude ?? 73.0479,
      heading: Math.random() * 360,
      speed: 40,
      label: v.registrationNumber,
    });
  });

  console.log(`📍 Simulating movement for ${vehicles.length} vehicles every ${INTERVAL_MS / 1000}s. Ctrl+C to stop.`);

  setInterval(async () => {
    for (const [vehicleId, state] of states.entries()) {
      const next = step(state);
      states.set(vehicleId, { ...state, ...next });
      try {
        await postLocation(vehicleId, next.lat, next.lng, Math.round(next.speed), Math.round(next.heading));
        console.log(
          `  ${state.label}: ${next.lat.toFixed(5)}, ${next.lng.toFixed(5)} @ ${Math.round(next.speed)}km/h`
        );
      } catch (err) {
        console.error(`  ${state.label}: failed to post location`, err.message);
      }
    }
  }, INTERVAL_MS);
};

run().catch((err) => {
  console.error('Simulator failed:', err.message);
  process.exit(1);
});
