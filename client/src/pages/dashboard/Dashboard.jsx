import { useEffect, useState } from 'react';
import StatCard from '../../components/common/StatCard.jsx';
import { getVehicles } from '../../services/vehicleService.js';
import { getShipments } from '../../services/shipmentService.js';
import { getDrivers } from '../../services/driverService.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getVehicles(), getShipments(), getDrivers()])
      .then(([vehiclesRes, shipmentsRes, driversRes]) => {
        const vehicles = vehiclesRes.vehicles || [];
        const shipments = shipmentsRes.shipments || [];
        const drivers = driversRes.drivers || [];

        setStats({
          totalVehicles: vehiclesRes.total ?? vehicles.length,
          inTransit: vehicles.filter((v) => v.status === 'in_transit').length,
          available: vehicles.filter((v) => v.status === 'available').length,
          totalDrivers: driversRes.total ?? drivers.length,
          activeShipments: shipments.filter((s) =>
            ['assigned', 'picked_up', 'in_transit', 'out_for_delivery'].includes(s.status)
          ).length,
          delivered: shipments.filter((s) => s.status === 'delivered').length,
          recentShipments: shipments.slice(0, 5),
        });
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard data'));
  }, []);

  if (error) {
    return <p className="text-danger text-sm">{error}</p>;
  }

  if (!stats) {
    return <p className="text-muted text-sm">Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Fleet and shipment overview</p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total Vehicles" value={stats.totalVehicles} />
        <StatCard label="In Transit" value={stats.inTransit} tone="warn" />
        <StatCard label="Available" value={stats.available} tone="ok" />
        <StatCard label="Total Drivers" value={stats.totalDrivers} />
        <StatCard label="Active Shipments" value={stats.activeShipments} tone="warn" />
        <StatCard label="Delivered" value={stats.delivered} tone="ok" />
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-ink mb-3">Recent Shipments</h2>
        <div className="rounded-lg border border-panelBorder bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-panelBorder text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Tracking #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentShipments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-muted text-center">
                    No shipments yet.
                  </td>
                </tr>
              )}
              {stats.recentShipments.map((s) => (
                <tr key={s._id} className="border-b border-panelBorder last:border-0">
                  <td className="px-4 py-3 text-ink">{s.trackingNumber}</td>
                  <td className="px-4 py-3 text-muted">{s.customer?.name}</td>
                  <td className="px-4 py-3 text-muted capitalize">{s.status?.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 text-muted capitalize">{s.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
