export default function StatCard({ label, value, tone = 'default' }) {
  const toneClasses = {
    default: 'text-ink',
    ok: 'text-ok',
    warn: 'text-warn',
    danger: 'text-danger',
  };

  return (
    <div className="rounded-lg border border-panelBorder bg-panel px-5 py-4">
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className={`mt-2 text-2xl font-semibold tabular ${toneClasses[tone]}`}>{value}</div>
    </div>
  );
}
