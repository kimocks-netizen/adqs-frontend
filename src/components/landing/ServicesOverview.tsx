import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Scale, FileText, Users, Heart, Search, Handshake } from 'lucide-react';
import { dummyServices } from '@/data/services';
import { ROUTES } from '@/routes/routes';

const SERVICE_ICONS = [Scale, FileText, Users, Heart, Search, Handshake];

export default function ServicesOverview() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      {/* Heading */}
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-secondary">What we do</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Legal consulting across six practice areas
        </h2>
        <p className="mt-4 text-muted-foreground">
          From regulatory compliance to dispute resolution — practical, research-led
          advisory for organisations and individuals.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {dummyServices.map((service, i) => {
          const Icon = SERVICE_ICONS[i] ?? Scale;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-card transition hover:-translate-y-1 hover:shadow-glow"
            >
              {/* Gold top accent on hover */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gold-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/8 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="mt-5 font-semibold leading-snug tracking-tight">
                {service.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {service.summary}
              </p>

              <Link
                to={ROUTES.SERVICE_DETAIL(service.slug)}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition hover:gap-2.5"
              >
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* View all */}
      <div className="mt-10 text-center">
        <Link
          to={ROUTES.SERVICES}
          className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
        >
          View all services <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
