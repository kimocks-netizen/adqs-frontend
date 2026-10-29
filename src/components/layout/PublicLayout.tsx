import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar — Phase 3 */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <span className="font-semibold text-primary">ADQS</span>
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="/" className="hover:text-secondary">Home</a>
            <a href="/about" className="hover:text-secondary">About</a>
            <a href="/services" className="hover:text-secondary">Services</a>
            <a href="/insights" className="hover:text-secondary">Insights</a>
            <a href="/contact" className="hover:text-secondary">Contact</a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer — Phase 3 */}
      <footer className="border-t bg-primary py-8 text-center text-sm text-white/70">
        © {new Date().getFullYear()} Adequate Strategies (Pty) Ltd
      </footer>
    </div>
  );
}
