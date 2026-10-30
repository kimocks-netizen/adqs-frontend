import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { useArticleStore } from '@/stores/useArticleStore';
import { CATEGORIES } from '@/data/articles';
import { ROUTES } from '@/routes/routes';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function InsightsPage() {
  const articles = useArticleStore((s) => s.articles).filter((a) => a.status === 'published');
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchCat = activeCategory === 'All' || a.category === activeCategory;
      const q = query.toLowerCase();
      const matchQ = !q || a.title.toLowerCase().includes(q) || a.introduction.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [activeCategory, query]);

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen bg-white">
      {/* Page Hero */}
      <section className="bg-brand-gradient pt-32 pb-16 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold tracking-widest uppercase text-yellow-300 mb-3"
          >
            Insights & News
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            Legal Insights
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 max-w-xl text-lg"
          >
            Analysis, opinions, and updates on South African law from the ADQS team.
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-[64px] z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-brand-gradient text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-56 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-14">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No articles found.</p>
        ) : (
          <>
            {/* Featured article */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-14"
              >
                <Link
                  to={ROUTES.ARTICLE_DETAIL(featured.slug)}
                  className="group grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-card hover:shadow-glow transition-shadow"
                >
                  <div className="h-64 md:h-auto overflow-hidden">
                    <img
                      src={featured.featured_image_url}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="bg-white p-8 flex flex-col justify-center">
                    <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-secondary mb-3">
                      {featured.category}
                    </span>
                    <h2 className="text-2xl font-bold text-brand-primary leading-snug mb-3 group-hover:text-brand-secondary transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-5">{featured.introduction}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> {featured.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {formatDate(featured.published_at)}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-semibold text-brand-secondary group-hover:gap-2 transition-all">
                      Read article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Article grid */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link
                      to={ROUTES.ARTICLE_DETAIL(article.slug)}
                      className="group flex flex-col rounded-xl overflow-hidden shadow-card hover:shadow-glow transition-shadow h-full"
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          src={article.featured_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col flex-1 p-5 bg-white">
                        <span className="text-xs font-bold uppercase tracking-widest text-brand-secondary mb-2">
                          {article.category}
                        </span>
                        <h3 className="text-base font-bold text-brand-primary leading-snug mb-2 group-hover:text-brand-secondary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-2 flex-1 mb-4">{article.introduction}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatDate(article.published_at)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
