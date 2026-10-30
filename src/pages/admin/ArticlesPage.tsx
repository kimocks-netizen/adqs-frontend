import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Pencil, Trash2, Search, FileText, Eye, EyeOff } from 'lucide-react';
import { useArticleStore } from '@/stores/useArticleStore';
import { ROUTES } from '@/routes/routes';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ArticlesPage() {
  const { articles, remove, toggleHidden } = useArticleStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'hidden'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
    if (filterStatus === 'hidden') return matchSearch && !!a.hidden;
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">Articles</h1>
          <p className="text-sm text-gray-500 mt-0.5">{articles.length} total</p>
        </div>
        <Link
          to={ROUTES.ADMIN_ARTICLE_NEW}
          className="flex items-center gap-2 bg-brand-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          <PlusCircle className="w-4 h-4" /> <span className="hidden sm:inline">New </span>Article
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'published', 'draft', 'hidden'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-colors ${
                filterStatus === s
                  ? 'bg-brand-primary text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FileText className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No articles found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="text-left px-5 py-3">Title</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3 hidden sm:table-cell">Date</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((article) => (
                <tr key={article.id} className={`hover:bg-gray-50 transition-colors ${article.hidden ? 'opacity-50' : ''}`}>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-gray-800 line-clamp-1">{article.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{article.slug}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{article.category}</td>
                  <td className="px-5 py-3.5 text-gray-400 hidden sm:table-cell">{formatDate(article.published_at)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        article.hidden
                          ? 'bg-gray-100 text-gray-400'
                          : article.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {article.hidden ? 'hidden' : article.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => toggleHidden(article.id)}
                        title={article.hidden ? 'Show article' : 'Hide article'}
                        className={`transition-colors ${article.hidden ? 'text-brand-secondary hover:text-brand-primary' : 'text-gray-300 hover:text-brand-secondary'}`}
                      >
                        {article.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <Link
                        to={ROUTES.ADMIN_ARTICLE_EDIT(article.id)}
                        className="text-gray-400 hover:text-brand-primary transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(article.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Article?</h3>
                <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 py-2.5 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { remove(deleteId); setDeleteId(null); }}
                    className="flex-1 py-2.5 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
