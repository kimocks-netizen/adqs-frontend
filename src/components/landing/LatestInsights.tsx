import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { dummyArticles } from '@/data/articles';
import { ROUTES } from '@/routes/routes';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function LatestInsights() {
  const articles = dummyArticles.slice(0, 3);

  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-secondary">Latest from ADQS</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Insights & Legal Updates
            </h2>
          </div>
          <Link
            to={ROUTES.INSIGHTS}
            className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-primary transition hover:gap-3"
          >
            Explore all insights <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-glow"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={article.featured_image_url}
                  alt={article.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                {/* Category badge */}
                <span className="absolute left-3 top-3 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground shadow-sm">
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-semibold leading-snug tracking-tight line-clamp-2">
                  {article.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {article.introduction}
                </p>

                <div className="mt-auto pt-5 flex items-center justify-between border-t border-border text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {article.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(article.published_at)}
                  </span>
                </div>

                <Link
                  to={ROUTES.ARTICLE_DETAIL(article.slug)}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition hover:gap-2.5"
                >
                  Read article <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
