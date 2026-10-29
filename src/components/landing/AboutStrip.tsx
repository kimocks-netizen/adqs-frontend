import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/routes/routes';

const PRINCIPLES = [
  { title: 'Clarity', desc: 'Plain-language advice that cuts through complexity.' },
  { title: 'Practicality', desc: 'Solutions grounded in real-world application.' },
  { title: 'Integrity', desc: 'Honest, independent and objective counsel.' },
  { title: 'Research', desc: 'Every recommendation is evidence-based.' },
  { title: 'Accessibility', desc: 'Legal guidance that is within reach.' },
];

export default function AboutStrip() {
  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-medium text-secondary">Our approach</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Principled advice. Practical outcomes.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Adequate Strategies Legal Consulting was founded on the belief that quality
              legal guidance should be accessible, clear and genuinely useful — not
              reserved for those who can afford the largest firms.
            </p>
            <Link
              to={ROUTES.ABOUT}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              About Us <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Principles grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {PRINCIPLES.map(({ title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-card"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
