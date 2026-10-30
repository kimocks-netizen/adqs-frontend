import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderOpen, Mail, FileText, Clock, ArrowRight,
  PlusCircle, Eye, TrendingUp, MousePointerClick,
  BarChart2, Send,
} from 'lucide-react';
import { useArticleStore } from '@/stores/useArticleStore';
import { ROUTES } from '@/routes/routes';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

const DUMMY_ENQUIRIES = [
  { id: '1', name: 'Thabo Mokoena',  area: 'Labour Relations',       date: '2025-01-14', status: 'New' },
  { id: '2', name: 'Nomsa Dlamini',  area: 'Regulatory Compliance',  date: '2025-01-13', status: 'New' },
  { id: '3', name: 'Sipho Khumalo',  area: 'Contracts & Commercial', date: '2025-01-12', status: 'Read' },
  { id: '4', name: 'Lerato Sithole', area: 'Human Rights',           date: '2025-01-11', status: 'Read' },
  { id: '5', name: 'Andile Nkosi',   area: 'General Enquiry',        date: '2025-01-10', status: 'Replied' },
];

// Hardcoded analytics — replace with GA4 Data API in Phase 14
const ANALYTICS = {
  pageViews:       1_842,
  articleClicks:   634,
  serviceViews:    411,
  formSubmissions: 28,
};

const TOP_ARTICLES = [
  { title: 'Understanding POPIA Compliance for SMEs',                          views: 214, clicks: 187 },
  { title: 'Labour Relations: A Guide to Disciplinary Procedures',             views: 198, clicks: 162 },
  { title: 'Contract Drafting Essentials: What Every Business Owner Should Know', views: 176, clicks: 143 },
  { title: 'Access to Justice in South Africa',                                views: 134, clicks: 98  },
  { title: 'AI in Law Firms — Smaller South African Towns',                    views: 112, clicks: 44  },
];

const TOP_SERVICES = [
  { name: 'Labour Relations',          views: 134 },
  { name: 'Contracts & Commercial',    views: 112 },
  { name: 'Regulatory Compliance',     views:  89 },
  { name: 'Administrative Law',        views:  76 },
];

export default function AdminDashboardPage() {
  const articleCount = useArticleStore((s) => s.articles.length);

  const STATS = [
    { label: 'Total Documents',    value: '12',               icon: FolderOpen, color: 'bg-blue-50 text-blue-600',   sub: 'Across 6 folders' },
    { label: 'Published Articles', value: String(articleCount), icon: FileText,   color: 'bg-green-50 text-green-600', sub: 'All published' },
    { label: 'Enquiries',          value: String(DUMMY_ENQUIRIES.length), icon: Mail, color: 'bg-yellow-50 text-yellow-600', sub: '2 new unread' },
    { label: 'Pending Replies',    value: '2',                icon: Clock,      color: 'bg-red-50 text-red-600',     sub: 'Awaiting response' },
  ];

  const ANALYTICS_STATS = [
    { label: 'Page Views',        value: ANALYTICS.pageViews.toLocaleString(),       icon: BarChart2,         color: 'bg-indigo-50 text-indigo-600', sub: 'Last 30 days' },
    { label: 'Article Clicks',    value: ANALYTICS.articleClicks.toLocaleString(),   icon: MousePointerClick, color: 'bg-purple-50 text-purple-600', sub: 'Insights page' },
    { label: 'Service Views',     value: ANALYTICS.serviceViews.toLocaleString(),    icon: TrendingUp,        color: 'bg-teal-50 text-teal-600',     sub: 'Services pages' },
    { label: 'Form Submissions',  value: ANALYTICS.formSubmissions.toLocaleString(), icon: Send,              color: 'bg-orange-50 text-orange-600', sub: 'Contact form' },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-brand-primary">Welcome back, Admin 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Here's what's happening on your site today.</p>
      </motion.div>

      {/* Content stats */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Content</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ label, value, icon: Icon, color, sub }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="bg-white rounded-xl p-3 shadow-card border border-gray-100 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}><Icon className="w-4 h-4" /></div>
              <div>
                <p className="text-lg font-bold text-brand-primary leading-none">{value}</p>
                <p className="text-xs font-medium text-gray-700 mt-0.5">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Analytics stats */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Analytics</p>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">Simulated · GA4 in Phase 14</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {ANALYTICS_STATS.map(({ label, value, icon: Icon, color, sub }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 + i * 0.07 }} className="bg-white rounded-xl p-3 shadow-card border border-gray-100 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}><Icon className="w-4 h-4" /></div>
              <div>
                <p className="text-lg font-bold text-brand-primary leading-none">{value}</p>
                <p className="text-xs font-medium text-gray-700 mt-0.5">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-card border border-gray-100"
      >
        <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
          <Link to={ROUTES.ADMIN_ARTICLE_NEW} className="flex items-center justify-center gap-2 bg-brand-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
            <PlusCircle className="w-4 h-4" /><span className="hidden sm:inline">New </span>Article
          </Link>
          <Link to={ROUTES.ADMIN_DOCUMENTS} className="flex items-center justify-center gap-2 bg-brand-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
            <PlusCircle className="w-4 h-4" /><span className="hidden sm:inline">New </span>Document
          </Link>
          <Link to={ROUTES.ADMIN_ENQUIRIES} className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors">
            <Mail className="w-4 h-4" /><span className="hidden sm:inline">View </span>Enquiries
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors">
            <Eye className="w-4 h-4" /><span className="hidden sm:inline">View </span>Site
          </a>
        </div>
      </motion.div>

      {/* Bottom grid — top articles + top services + recent enquiries */}
      <div className="grid lg:grid-cols-[1fr_220px] gap-6">

        {/* Top articles */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest">Top Articles</h2>
            <Link to={ROUTES.ADMIN_ARTICLES} className="flex items-center gap-1 text-xs text-brand-secondary font-semibold hover:underline">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {/* Desktop table */}
          <table className="hidden sm:table w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                <th className="text-left px-6 py-2.5">Article</th>
                <th className="text-right px-6 py-2.5">Views</th>
                <th className="text-right px-6 py-2.5">Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TOP_ARTICLES.map((a, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-gray-700 font-medium">{a.title}</td>
                  <td className="px-6 py-3 text-right text-gray-500">{a.views}</td>
                  <td className="px-6 py-3 text-right"><span className="text-brand-secondary font-semibold">{a.clicks}</span></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile card list */}
          <div className="sm:hidden divide-y divide-gray-50">
            {TOP_ARTICLES.map((a, i) => (
              <div key={i} className="px-4 py-3 flex items-start justify-between gap-3">
                <p className="text-sm text-gray-700 font-medium flex-1 leading-snug">{a.title}</p>
                <div className="flex flex-col items-end shrink-0 gap-0.5">
                  <span className="text-brand-secondary font-bold text-sm">{a.clicks} <span className="text-xs font-normal text-gray-400">clicks</span></span>
                  <span className="text-xs text-gray-400">{a.views} views</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top services */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest">Top Services</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {TOP_SERVICES.map((s, i) => {
              const max = TOP_SERVICES[0].views;
              const pct = Math.round((s.views / max) * 100);
              return (
                <div key={i} className="px-5 py-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold text-gray-700 truncate">{s.name}</p>
                    <p className="text-xs text-gray-400 shrink-0 ml-2">{s.views}</p>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-gradient rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent enquiries */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.46 }}
        className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest">Recent Enquiries</h2>
          <Link to={ROUTES.ADMIN_ENQUIRIES} className="flex items-center gap-1 text-xs text-brand-secondary font-semibold hover:underline">
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
                enq.status === 'New' ? 'bg-yellow-100 text-yellow-700'
                : enq.status === 'Replied' ? 'bg-green-100 text-green-700'
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
