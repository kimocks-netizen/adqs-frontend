import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/routes/routes';

export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Navy overlay */}
      <div className="absolute inset-0 bg-brand-gradient opacity-75" />

      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to get practical legal guidance?
          </h2>
          <p className="max-w-xl text-white/80">
            Tell us about your situation and we'll respond with clarity on how we
            can help — no jargon, no obligation.
          </p>
          <Link
            to={ROUTES.CONTACT}
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-3.5 text-sm font-semibold text-secondary-foreground shadow-gold transition hover:opacity-90 hover:scale-[1.02]"
          >
            Make an Enquiry <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
