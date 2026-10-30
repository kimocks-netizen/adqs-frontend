import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import {
  LayoutDashboard, FolderOpen, Mail, LogOut,
  ChevronRight, User, FileText,
} from 'lucide-react';
import logo from '@/assets/logo.jpg';

const NAV = [
  { to: ROUTES.ADMIN,           label: 'Dashboard', icon: LayoutDashboard, end: true  },
  { to: ROUTES.ADMIN_DOCUMENTS, label: 'Documents', icon: FolderOpen,      end: false },
  { to: ROUTES.ADMIN_ARTICLES,  label: 'Articles',  icon: FileText,        end: false },
  { to: ROUTES.ADMIN_ENQUIRIES, label: 'Enquiries', icon: Mail,            end: false },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    sessionStorage.removeItem('adqs_admin');
    navigate(ROUTES.ADMIN_LOGIN);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-60 flex-col bg-primary text-white shrink-0 z-40">
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
              <p className="text-xs font-semibold truncate">Administrator</p>
              <p className="text-[10px] text-white/50 truncate">admin@adqs.co.za</p>
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

      {/* ── Main content ── */}
      <div className="flex flex-1 flex-col min-w-0 md:ml-60">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-4 md:px-6 bg-white border-b border-gray-100 shrink-0">
          {/* Mobile: show logo */}
          <div className="flex items-center gap-2 md:hidden">
            <img src={logo} alt="ADQS" className="h-7 w-auto object-contain rounded" />
            <span className="text-sm font-bold text-brand-primary">Admin Portal</span>
          </div>
          {/* Desktop: show subtitle */}
          <p className="hidden md:block text-sm text-gray-500">Adequate Strategies — Content Management</p>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-brand-secondary/10 text-brand-secondary font-semibold px-3 py-1 rounded-full">
              Admin
            </span>
            {/* Mobile sign out */}
            <button
              onClick={handleLogout}
              className="md:hidden text-gray-400 hover:text-red-500 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content — extra bottom padding on mobile for the bottom nav */}
        <main className="flex-1 p-4 md:p-6 overflow-auto pb-16 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* ── Mobile bottom nav (WhatsApp style, hidden on desktop) ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-100 shadow-lg">
        <div className="flex items-center justify-around h-12">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center justify-center gap-1.5 flex-1 h-full text-xs font-semibold transition-colors ${
                  isActive ? 'text-brand-primary' : 'text-gray-400 hover:text-gray-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className={`text-[11px] font-semibold ${isActive ? 'text-brand-primary' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

    </div>
  );
}
