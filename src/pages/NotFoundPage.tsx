import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/routes/routes';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-soft flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-8xl font-bold text-brand-gradient mb-4">404</p>
        <h1 className="text-2xl font-bold text-brand-primary mb-3">Page not found</h1>
        <p className="text-gray-500 text-sm max-w-sm mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 bg-brand-gradient text-white text-sm font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
