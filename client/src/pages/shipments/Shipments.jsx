import { useEffect, useState } from 'react';
import { getShipments } from '../../services/shipmentService.js';

const priorityTone = {
  low: 'text-muted',
  normal: 'text-ink',
  high: 'text-warn',
  urgent: 'text-danger',
};

export default function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getShipments()
      .then((data) => setShipments(data.shipments || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load shipments'));
  }, []);

  return (
    <div>
      <h1 className="text-lg font-semibold text-ink">Shipments</h1>
      <p className="mt-1 text-sm text-muted">{shipments.length} shipments on record</p>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <div className="mt-6 rounded-lg border border-panelBorder bg-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-panelBorder text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Tracking #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Expected Delivery</th>
            </tr>
          </thead>
          <tbody>
            {shipments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-muted text-center">
                  No shipments yet.
                </td>
              </tr>
            )}
            {shipments.map((s) => (
              <tr key={s._id} className="border-b border-panelBorder last:border-0">
                <td className="px-4 py-3 text-ink">{s.trackingNumber}</td>
                <td className="px-4 py-3 text-muted">{s.customer?.name}</td>
                <td className="px-4 py-3 text-muted capitalize">{s.status?.replace(/_/g, ' ')}</td>
                <td className={`px-4 py-3 capitalize ${priorityTone[s.priority] || 'text-muted'}`}>
                  {s.priority}
                </td>
                <td className="px-4 py-3 text-muted">
                  {s.expectedDelivery ? new Date(s.expectedDelivery).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
