import { useEffect, useState } from 'react';
import { getVehicles } from '../../services/vehicleService.js';

const statusTone = {
  available: 'text-ok',
  in_transit: 'text-warn',
  idle: 'text-muted',
  maintenance: 'text-danger',
  offline: 'text-danger',
  inactive: 'text-muted',
};

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getVehicles()
      .then((data) => setVehicles(data.vehicles || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load vehicles'));
  }, []);

  return (
    <div>
      <h1 className="text-lg font-semibold text-ink">Vehicles</h1>
      <p className="mt-1 text-sm text-muted">{vehicles.length} vehicles in the fleet</p>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <div className="mt-6 rounded-lg border border-panelBorder bg-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-panelBorder text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Registration</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Make / Model</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Driver</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-muted text-center">
                  No vehicles yet.
                </td>
              </tr>
            )}
            {vehicles.map((v) => (
              <tr key={v._id} className="border-b border-panelBorder last:border-0">
                <td className="px-4 py-3 text-ink">{v.registrationNumber}</td>
                <td className="px-4 py-3 text-muted capitalize">{v.type?.replace(/_/g, ' ')}</td>
                <td className="px-4 py-3 text-muted">{v.make} {v.model}</td>
                <td className={`px-4 py-3 capitalize ${statusTone[v.status] || 'text-muted'}`}>
                  {v.status?.replace(/_/g, ' ')}
                </td>
                <td className="px-4 py-3 text-muted">{v.assignedDriver?.name || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
