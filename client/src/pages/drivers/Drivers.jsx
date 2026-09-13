import { useEffect, useState } from 'react';
import { getDrivers } from '../../services/driverService.js';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getDrivers()
      .then((data) => setDrivers(data.drivers || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load drivers'));
  }, []);

  return (
    <div>
      <h1 className="text-lg font-semibold text-ink">Drivers</h1>
      <p className="mt-1 text-sm text-muted">{drivers.length} drivers on record</p>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <div className="mt-6 rounded-lg border border-panelBorder bg-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-panelBorder text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">License</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Vehicle</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-muted text-center">
                  No drivers yet.
                </td>
              </tr>
            )}
            {drivers.map((d) => (
              <tr key={d._id} className="border-b border-panelBorder last:border-0">
                <td className="px-4 py-3 text-ink">{d.name}</td>
                <td className="px-4 py-3 text-muted">{d.phone}</td>
                <td className="px-4 py-3 text-muted">{d.licenseNumber}</td>
                <td className="px-4 py-3 text-muted capitalize">{d.status?.replace(/_/g, ' ')}</td>
                <td className="px-4 py-3 text-muted">{d.assignedVehicle?.registrationNumber || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
