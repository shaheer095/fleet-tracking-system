import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Package, MapPin } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tracking', label: 'Live Tracking', icon: MapPin },
  { to: '/vehicles', label: 'Vehicles', icon: Truck },
  { to: '/drivers', label: 'Drivers', icon: Users },
  { to: '/shipments', label: 'Shipments', icon: Package },
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-panelBorder bg-panel">
      <div className="px-5 py-5 border-b border-panelBorder">
        <span className="text-sm font-semibold tracking-wide text-ink">Fleet Tracking</span>
      </div>
      <nav className="px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-base text-ink border border-panelBorder'
                  : 'text-muted hover:text-ink hover:bg-base/50'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
