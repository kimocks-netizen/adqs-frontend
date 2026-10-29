import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { ROUTES } from '@/routes/routes';
import { LayoutDashboard, FileText, Mail, LogOut } from 'lucide-react';

const navItems = [
  { to: ROUTES.ADMIN, label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: ROUTES.ADMIN_ARTICLES, label: 'Articles', icon: FileText, end: false },
  { to: ROUTES.ADMIN_ENQUIRIES, label: 'Enquiries', icon: Mail, end: false },
];

export default function AdminLayout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(ROUTES.ADMIN_LOGIN);
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 flex-col border-r bg-primary text-white">
        <div className="flex h-16 items-center px-6 font-semibold tracking-wide">
          ADQS Admin
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive ? 'bg-white/20 font-medium' : 'hover:bg-white/10'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-4 text-sm text-white/70 hover:text-white"
        >
          <LogOut size={16} />
          Logout
        </button>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b bg-white px-6">
          <span className="text-sm text-muted-foreground">Adequate Strategies CMS</span>
        </header>
        <main className="flex-1 bg-muted/30 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
