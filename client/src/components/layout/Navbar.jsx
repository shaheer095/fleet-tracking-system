import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-panelBorder bg-panel px-6">
      <div className="text-sm text-muted">
        {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm text-ink">{user?.name}</div>
          <div className="text-xs text-muted capitalize">{user?.role?.replace('_', ' ')}</div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-md border border-panelBorder px-3 py-1.5 text-xs text-muted hover:text-ink hover:border-muted transition-colors"
        >
          <LogOut size={14} />
          Log out
        </button>
      </div>
    </header>
  );
}
