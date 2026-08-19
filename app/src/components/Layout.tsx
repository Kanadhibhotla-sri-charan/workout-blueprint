import { NavLink, Outlet } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link nav-link-active' : 'nav-link';

export function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink to="/" className="brand" end>
          Physique Blueprint
        </NavLink>
        <nav className="app-nav" aria-label="Primary">
          <NavLink to="/exercises" className={navLinkClass}>
            Explore
          </NavLink>
          <NavLink to="/decide" className={navLinkClass}>
            Decide
          </NavLink>
          <NavLink to="/build" className={navLinkClass}>
            Build
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
