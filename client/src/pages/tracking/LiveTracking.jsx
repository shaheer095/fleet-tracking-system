import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getVehicles } from '../../services/vehicleService.js';
import useSocket from '../../hooks/useSocket.js';

// Leaflet's default marker icons don't resolve correctly under bundlers;
// rebuild them from CDN URLs so pins actually render.
const vehicleIcon = (status) => {
  const color = status === 'in_transit' ? '#F59E0B' : status === 'available' ? '#22C55E' : '#94A3B8';
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #0F172A;box-shadow:0 0 0 2px ${color}55;"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

const DEFAULT_CENTER = [30.3753, 69.3451]; // Pakistan, roughly centered

export default function LiveTracking() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    getVehicles()
      .then((data) => setVehicles(data.vehicles || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load vehicles'));
  }, []);

  // Live location updates pushed from the backend over Socket.IO
  useSocket({
    'vehicle:location': (payload) => {
      setVehicles((prev) =>
        prev.map((v) =>
          v._id === payload.vehicleId
            ? {
                ...v,
                status: payload.status || v.status,
                currentLocation: {
                  ...v.currentLocation,
                  latitude: payload.latitude,
                  longitude: payload.longitude,
                  lastUpdated: payload.timestamp,
                },
                _speed: payload.speed,
                _heading: payload.heading,
              }
            : v
        )
      );
      setLastUpdate(new Date());
    },
    'vehicle:status-update': (payload) => {
      setVehicles((prev) =>
        prev.map((v) => (v._id === payload.vehicleId ? { ...v, status: payload.status } : v))
      );
    },
  });

  const center = useMemo(() => {
    const withLocation = vehicles.find((v) => v.currentLocation?.latitude);
    return withLocation
      ? [withLocation.currentLocation.latitude, withLocation.currentLocation.longitude]
      : DEFAULT_CENTER;
  }, [vehicles.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink">Live Tracking</h1>
          <p className="mt-1 text-sm text-muted">
            {vehicles.length} vehicles ·{' '}
            {lastUpdate ? `last update ${lastUpdate.toLocaleTimeString()}` : 'waiting for location updates...'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="h-2 w-2 rounded-full bg-ok animate-pulse" />
          Live
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <div className="mt-4 flex-1 overflow-hidden rounded-lg border border-panelBorder">
        <MapContainer center={center} zoom={6} className="h-full w-full" style={{ background: '#0F172A' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {vehicles
            .filter((v) => v.currentLocation?.latitude && v.currentLocation?.longitude)
            .map((v) => (
              <Marker
                key={v._id}
                position={[v.currentLocation.latitude, v.currentLocation.longitude]}
                icon={vehicleIcon(v.status)}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{v.registrationNumber}</div>
                    <div className="capitalize">{v.status?.replace(/_/g, ' ')}</div>
                    {v.assignedDriver?.name && <div>Driver: {v.assignedDriver.name}</div>}
                    {v._speed != null && <div>Speed: {v._speed} km/h</div>}
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}
