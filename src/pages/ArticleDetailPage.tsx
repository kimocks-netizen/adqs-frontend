import { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ChevronRight, ArrowLeft } from 'lucide-react';
import { dummyArticles, CATEGORIES } from '@/data/articles';
import { ROUTES } from '@/routes/routes';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Minimal markdown-to-JSX: renders ##, **bold**, - lists, paragraphs */
function RenderBody({ body }: { body: string }) {
  const lines = body.split('\n');
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (key: string) => {
    if (listBuffer.length) {
      elements.push(
        <ul key={key} className="list-disc list-inside space-y-1 text-gray-600 mb-4 pl-2">
          {listBuffer.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: parseBold(item) }} />
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  const parseBold = (text: string) =>
    text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-brand-primary font-semibold">$1</strong>');

  lines.forEach((line, i) => {
    if (line.startsWith('## ')) {
      flushList(`list-${i}`);
      elements.push(
        <h2 key={i} className="text-xl font-bold text-brand-primary mt-8 mb-3 border-b border-gray-100 pb-2">
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      flushList(`list-${i}`);
      elements.push(
        <h3 key={i} className="text-base font-bold text-brand-primary mt-6 mb-2">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      listBuffer.push(line.replace('- ', ''));
    } else if (/^\d+\.\s/.test(line)) {
      flushList(`list-${i}`);
      elements.push(
        <p key={i} className="text-gray-600 mb-1 pl-2" dangerouslySetInnerHTML={{ __html: parseBold(line) }} />
      );
    } else if (line.trim() === '') {
      flushList(`list-${i}`);
    } else {
      flushList(`list-${i}`);
      elements.push(
        <p key={i} className="text-gray-600 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: parseBold(line) }} />
      );
    }
  });
  flushList('final');

  return <div>{elements}</div>;
}

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const article = dummyArticles.find((a) => a.slug === slug);

  const related = useMemo(
    () => dummyArticles.filter((a) => a.slug !== slug && a.category === article?.category).slice(0, 3),
    [slug, article]
  );

  if (!article) return <Navigate to={ROUTES.INSIGHTS} replace />;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero banner */}
      <section className="relative bg-brand-gradient pt-32 pb-0 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/60 mb-6">
            <Link to={ROUTES.HOME} className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={ROUTES.INSIGHTS} className="hover:text-white transition-colors">Insights</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90 line-clamp-1">{article.title}</span>
          </nav>

          <span className="inline-block text-xs font-bold uppercase tracking-widest text-yellow-300 mb-3">
            {article.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-snug max-w-3xl mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-5 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {article.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(article.published_at)}</span>
          </div>
        </div>
      </section>

      {/* Featured image */}
      <div className="max-w-6xl mx-auto px-6 -mt-0">
        <div className="h-64 sm:h-80 rounded-b-2xl overflow-hidden shadow-card">
          <img src={article.featured_image_url} alt={article.title} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="max-w-6xl mx-auto px-6 py-14 grid lg:grid-cols-[1fr_300px] gap-12 items-start">
        {/* Article body */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Introduction */}
          <p className="text-lg text-gray-700 font-medium leading-relaxed border-l-4 border-brand-secondary pl-5 mb-8">
            {article.introduction}
          </p>

          <RenderBody body={article.body} />

          {/* Back link */}
          <div className="mt-12 pt-6 border-t border-gray-100">
            <Link
              to={ROUTES.INSIGHTS}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-secondary hover:gap-3 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Insights
            </Link>
          </div>
        </motion.article>

        {/* Sidebar */}
        <aside className="space-y-8 lg:sticky lg:top-28">
          {/* Categories */}
          <div className="bg-soft rounded-xl p-5">
            <h4 className="text-sm font-bold uppercase tracking-widest text-brand-primary mb-4">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <li key={cat}>
                  <Link
                    to={ROUTES.INSIGHTS}
                    state={{ category: cat }}
                    className={`text-sm transition-colors ${
                      cat === article.category
                        ? 'text-brand-secondary font-semibold'
                        : 'text-gray-500 hover:text-brand-primary'
                    }`}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-brand-primary mb-4">Related Articles</h4>
              <ul className="space-y-4">
                {related.map((a) => (
                  <li key={a.id}>
                    <Link to={ROUTES.ARTICLE_DETAIL(a.slug)} className="group flex gap-3 items-start">
                      <img
                        src={a.featured_image_url}
                        alt={a.title}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                      <div>
                        <p className="text-sm font-semibold text-brand-primary leading-snug group-hover:text-brand-secondary transition-colors line-clamp-2">
                          {a.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(a.published_at)}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="bg-brand-gradient rounded-xl p-6 text-white text-center">
            <p className="text-sm font-semibold mb-1">Need legal guidance?</p>
            <p className="text-xs text-white/70 mb-4">Our team is ready to assist with your matter.</p>
            <Link
              to={ROUTES.CONTACT}
              className="inline-block bg-brand-secondary text-white text-sm font-bold px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              Make an Enquiry
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
