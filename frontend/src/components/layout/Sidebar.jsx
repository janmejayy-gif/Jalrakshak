import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { classNames } from '../../utils';

const navigation = [
  { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { path: '/farms', label: 'My Farms', icon: FarmsIcon },
  { path: '/history', label: 'History', icon: HistoryIcon },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
];

function DashboardIcon({ className }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className={className} aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function FarmsIcon({ className }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className={className} aria-hidden="true">
      <path d="M21 10V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
      <path d="M18 10V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v5" />
      <path d="M3 10v10a2 2 0 0 0 2 2h14" />
    </svg>
  );
}

function HistoryIcon({ className }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SettingsIcon({ className }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function MenuItem({ item, isActive, collapsed, onClick }) {
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive: active }) => classNames(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
        active
          ? 'bg-forest-green-light text-white'
          : 'text-secondary hover:bg-earth-light hover:text-primary',
        collapsed && 'justify-center'
      )}
      style={{ textDecoration: 'none' }}
      aria-current={isActive ? 'page' : undefined}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className="flex-shrink-0" aria-hidden="true" />
      {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
    </NavLink>
  );
}

export function Sidebar({ isOpen, onClose, collapsed = false }) {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
<aside
        className={classNames(
          'fixed top-0 left-0 z-50 bg-white border-r border-border-light transition-all duration-300 flex flex-col',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          collapsed ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]',
          'md:w-[var(--sidebar-width)]'
        )}
        style={{
          height: 'calc(100vh - var(--header-height))',
          top: 'var(--header-height)',
        }}
        aria-label="Main navigation"
      >
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Navigation menu">
          {navigation.map((item) => (
            <MenuItem
              key={item.path}
              item={item}
              isActive={location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))}
              collapsed={collapsed}
              onClick={onClose}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-border-light">
          <div className={classNames('flex items-center gap-3', collapsed && 'justify-center')}>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <span className="text-white font-medium text-sm">
                {user?.fullName?.charAt(0) || 'F'}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-primary truncate">{user?.fullName || 'Farmer'}</p>
                <p className="text-xs text-muted truncate">{user?.email || user?.phone}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;