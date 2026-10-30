import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { ROUTES } from '@/routes/routes';
import {
  LayoutDashboard,
  FolderOpen,
  Mail,
  LogOut,
  ChevronRight,
  User,
} from 'lucide-react';
import logo from '@/assets/logo.jpg';

const NAV = [
  { to: ROUTES.ADMIN, label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: ROUTES.ADMIN_ARTICLES, label: 'Documents', icon: FolderOpen, end: false },
  { to: ROUTES.ADMIN_ENQUIRIES, label: 'Enquiries', icon: Mail, end: false },
];

export default function AdminLayout() {
  const { logout, user } = useAuthStore((s) => ({ logout: s.logout, user: s.user }));
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(ROUTES.ADMIN_LOGIN);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col bg-primary text-white shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <img src={logo} alt="ADQS" className="h-8 w-auto object-contain rounded" />
          <div>
            <p className="text-xs font-bold leading-tight">ADQS</p>
            <p className="text-[10px] text-white/50 leading-tight">Admin Portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-white/20 font-semibold text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              <ChevronRight className="w-3 h-3 ml-auto opacity-40" />
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">{user?.name ?? 'Administrator'}</p>
              <p className="text-[10px] text-white/50 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-gray-100 shrink-0">
          <p className="text-sm text-gray-500">Adequate Strategies — Content Management</p>
          <span className="text-xs bg-brand-secondary/10 text-brand-secondary font-semibold px-3 py-1 rounded-full">
            {user?.role ?? 'Admin'}
          </span>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
