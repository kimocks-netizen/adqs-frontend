import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-muted-foreground">Page not found.</p>
      <Link to={ROUTES.HOME} className="text-sm underline hover:text-secondary">
        Back to home
      </Link>
    </div>
  );
}
