import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

export function Header({ onMenuClick }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-border-light" style={{ height: 'var(--header-height)' }}>
      <div className="container flex items-center justify-between h-full">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="btn-ghost btn-sm mobile-hidden"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <NavLink to="/" className="flex items-center gap-2" aria-label="JALRAKSHAK Home">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
              <path d="M8 20L16 12L24 20" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              <path d="M16 12V20" stroke="white" stroke-width="2.5" stroke-linecap="round" />
            </svg>
            <span className="font-bold text-xl text-primary">JALRAKSHAK</span>
          </NavLink>
        </div>

        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          <NavLink
            to="/dashboard"
            className="text-sm font-medium transition-colors hover:text-primary"
            end
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/farms"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            My Farms
          </NavLink>
          <NavLink
            to="/history"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            History
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-sm font-medium text-primary">{user?.fullName || 'Farmer'}</span>
                <span className="text-xs text-muted">{user?.email || user?.phone}</span>
              </div>
              <button
                type="button"
                className="btn-ghost btn-sm"
                onClick={handleLogout}
                aria-label="Log out"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className="btn-ghost btn-sm hidden sm:inline-flex">
                Log In
              </NavLink>
              <NavLink to="/register" className="btn-primary btn-sm">
                Get Started
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;