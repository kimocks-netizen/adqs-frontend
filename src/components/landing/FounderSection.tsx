import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import meetFounderImg from '@/assets/meet-founder.png';

export default function FounderSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-sm lg:max-w-none"
        >
          <div className="absolute -inset-4 rounded-3xl bg-brand-gradient opacity-10 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-border shadow-glow">
            <img
              src={meetFounderImg}
              alt="Bright Ngwenyama Gunde — Founder & Principal Consultant"
              className="h-auto w-full object-cover"
            />
            {/* Gold bottom bar */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gold-gradient" />
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-medium text-secondary">Meet the founder</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Bright Ngwenyama Gunde
          </h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            Founder & Principal Consultant
          </p>
          <p className="mt-5 leading-relaxed text-muted-foreground text-justify">
            Bright Ngwenyama Gunde is a legal consultant with experience spanning
            regulatory compliance, labour relations, human rights and legal research.
            He founded Adequate Strategies Legal Consulting to provide accessible,
            research-informed legal advisory services to businesses and individuals
            across South Africa.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground text-justify">
            His work is guided by a commitment to clarity, practical outcomes and
            the belief that sound legal guidance should be within reach of those
            who need it most.
          </p>
          <Link
            to={ROUTES.ABOUT}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
          >
            Read full profile <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
