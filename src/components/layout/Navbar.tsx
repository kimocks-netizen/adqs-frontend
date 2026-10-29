import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import logo from '@/assets/logo.jpg';

const NAV_LINKS = [
  { to: ROUTES.HOME, label: 'Home', end: true },
  { to: ROUTES.ABOUT, label: 'About', end: false },
  { to: ROUTES.SERVICES, label: 'Services', end: false },
  { to: ROUTES.INSIGHTS, label: 'Insights', end: false },
  { to: ROUTES.CONTACT, label: 'Contact', end: false },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Scroll shadow + background opacity
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on scroll (mobile)
  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [open]);

  return (
    <header
      ref={menuRef}
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-border/60 bg-white/95 shadow-card backdrop-blur-xl'
          : 'border-transparent bg-white/80 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
          <img src={logo} alt="Adequate Strategies Legal Consulting" className="h-10 w-auto object-contain" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-sm md:flex">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative py-1 font-medium transition-colors ${
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  <span
                    className={`pointer-events-none absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-secondary transition-all duration-300 ${
                      isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.CONTACT}
            className="hidden rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:inline-flex"
          >
            Make an Enquiry
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:text-foreground md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute inset-x-0 top-16 border-t border-border/60 bg-white/95 shadow-lg backdrop-blur-xl md:hidden">
          <nav className="flex flex-col px-6 py-3">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center justify-between border-b border-border/40 py-3.5 text-sm last:border-0 ${
                    isActive ? 'font-semibold text-foreground' : 'text-muted-foreground'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && <span className="h-2 w-2 rounded-full bg-secondary" />}
                  </>
                )}
              </NavLink>
            ))}
            <Link
              to={ROUTES.CONTACT}
              className="mt-3 mb-1 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Make an Enquiry
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
