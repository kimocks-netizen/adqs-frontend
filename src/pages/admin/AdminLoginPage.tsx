import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';

export default function AdminLoginPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  function handleDummyLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuth({ id: '1', email: 'admin@adqs.co.za' }, 'dummy-token');
    navigate(ROUTES.ADMIN);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <form onSubmit={handleDummyLogin} className="w-full max-w-sm space-y-4 rounded-lg border bg-white p-8 shadow-card">
        <h1 className="text-xl font-semibold text-primary">ADQS Admin</h1>
        <input type="email" placeholder="Email" defaultValue="admin@adqs.co.za" className="w-full rounded border px-3 py-2 text-sm" />
        <input type="password" placeholder="Password" defaultValue="password" className="w-full rounded border px-3 py-2 text-sm" />
        <button type="submit" className="w-full rounded bg-primary py-2 text-sm font-medium text-white hover:opacity-90">
          Sign in
        </button>
        <p className="text-center text-xs text-muted-foreground">Phase 10 — dummy login (no API yet)</p>
      </form>
    </div>
  );
}
