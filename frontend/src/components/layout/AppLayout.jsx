import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header, Sidebar, Footer } from './index';

export function AppLayout({ showFooter = true }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  if (location.pathname === '/') {
    return <Outlet />;
  }

  return (
    <div className="app-layout">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        collapsed={false}
      />
      <main className="main-content" style={{ marginTop: 'var(--header-height)' }}>
        <Outlet />
        {showFooter && <Footer />}
      </main>
    </div>
  );
}

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => {}} />
      <main className="flex-1 flex items-center justify-center py-12 px-4" style={{ marginTop: 'var(--header-height)' }}>
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;