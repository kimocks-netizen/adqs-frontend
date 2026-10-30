import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  Mail,
  FileText,
  Clock,
  ArrowRight,
  PlusCircle,
  Eye,
} from 'lucide-react';
import { useArticleStore } from '@/stores/useArticleStore';
import { ROUTES } from '@/routes/routes';

// Dummy enquiries for simulation
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminDashboardPage() {
  const articleCount = useArticleStore((s) => s.articles.length);

  const DUMMY_ENQUIRIES = [
    { id: '1', name: 'Thabo Mokoena', area: 'Labour Relations', date: '2025-01-14', status: 'New' },
    { id: '2', name: 'Nomsa Dlamini', area: 'Regulatory Compliance', date: '2025-01-13', status: 'New' },
    { id: '3', name: 'Sipho Khumalo', area: 'Contracts & Commercial', date: '2025-01-12', status: 'Read' },
    { id: '4', name: 'Lerato Sithole', area: 'Human Rights', date: '2025-01-11', status: 'Read' },
    { id: '5', name: 'Andile Nkosi', area: 'General Enquiry', date: '2025-01-10', status: 'Replied' },
  ];

  const STATS = [
    { label: 'Total Documents', value: '12', icon: FolderOpen, color: 'bg-blue-50 text-blue-600', sub: 'Across 6 folders' },
    { label: 'Published Articles', value: String(articleCount), icon: FileText, color: 'bg-green-50 text-green-600', sub: 'All published' },
    { label: 'Enquiries', value: String(DUMMY_ENQUIRIES.length), icon: Mail, color: 'bg-yellow-50 text-yellow-600', sub: '2 new unread' },
    { label: 'Pending Replies', value: '2', icon: Clock, color: 'bg-red-50 text-red-600', sub: 'Awaiting response' },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-brand-primary">
          Welcome back, Admin 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">Here's what's happening on your site today.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color, sub }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-xl p-5 shadow-card border border-gray-100"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-brand-primary">{value}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-card border border-gray-100"
      >
        <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to={ROUTES.ADMIN_ARTICLES}
            className="flex items-center gap-2 bg-brand-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            <PlusCircle className="w-4 h-4" /> New Document
          </Link>
          <Link
            to={ROUTES.ADMIN_ENQUIRIES}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Mail className="w-4 h-4" /> View Enquiries
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gray-100 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" /> View Site
          </a>
        </div>
      </motion.div>

      {/* Recent enquiries */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest">Recent Enquiries</h2>
          <Link
            to={ROUTES.ADMIN_ENQUIRIES}
            className="flex items-center gap-1 text-xs text-brand-secondary font-semibold hover:underline"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {DUMMY_ENQUIRIES.slice(0, 4).map((enq) => (
            <div key={enq.id} className="flex items-center justify-between px-6 py-3.5">
              <div>
                <p className="text-sm font-semibold text-gray-800">{enq.name}</p>
                <p className="text-xs text-gray-400">{enq.area} · {formatDate(enq.date)}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                enq.status === 'New'
                  ? 'bg-yellow-100 text-yellow-700'
                  : enq.status === 'Replied'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {enq.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
