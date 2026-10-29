import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { ROUTES } from '@/routes/routes';

const CREDIBILITY = [
  '6 Service Areas',
  'Research-Informed',
  'South Africa',
  'Practical Solutions',
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-soft">
      {/* Background gradient blob */}
      <div className="pointer-events-none absolute -top-32 right-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-secondary/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pt-28 lg:pt-36">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          Adequate Strategies Legal Consulting
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          Practical Legal Solutions.{' '}
          <span className="text-brand-gradient">Informed Decisions.</span>{' '}
          Stronger Institutions.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
        >
          We help businesses, institutions and individuals navigate complex legal
          landscapes with clarity, research and practical strategy — across South Africa.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Link
            to={ROUTES.SERVICES}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-90 hover:scale-[1.02]"
          >
            Explore Our Services
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to={ROUTES.INSIGHTS}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-white"
          >
            <BookOpen className="h-4 w-4 text-secondary" />
            Read Our Insights
          </Link>
        </motion.div>

        {/* Credibility strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2"
        >
          {CREDIBILITY.map((item, i) => (
            <span key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-secondary/60" />}
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
