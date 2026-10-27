import { useCallback, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { CommandPalette } from './CommandPalette';
import { useCommandPaletteShortcut } from '../utils/commandPalette';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link nav-link-active' : 'nav-link';

const bottomNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'bottom-nav-link bottom-nav-link-active' : 'bottom-nav-link';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

// A new page starts at the top. Query-only changes (filters, a Decide
// submission) keep their position; Decide scrolls to its own result.
function useScrollToTopOnPageChange() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
}

export function Layout() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  useCommandPaletteShortcut(openPalette);
  useScrollToTopOnPageChange();

  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink to="/" className="brand" end>
          <span className="brand-mark" aria-hidden="true">
            &#9670;
          </span>
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
        <button type="button" className="command-trigger" onClick={openPalette} aria-label="Search (Ctrl+K)">
          <span className="command-trigger-icon" aria-hidden="true">⌕</span>
          <span className="command-trigger-text">Search</span>
          <kbd className="command-trigger-kbd">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
        </button>
      </header>
      {paletteOpen && <CommandPalette onClose={closePalette} />}
      <main className="app-main">
        <Outlet />
      </main>
      <nav className="bottom-nav" aria-label="Primary">
        <NavLink to="/exercises" className={bottomNavLinkClass}>
          Explore
        </NavLink>
        <NavLink to="/decide" className={bottomNavLinkClass}>
          Decide
        </NavLink>
        <NavLink to="/build" className={bottomNavLinkClass}>
          Build
        </NavLink>
      </nav>
    </div>
  );
}
