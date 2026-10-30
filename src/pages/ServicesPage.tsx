import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Scale, FileText, Users, Heart, Search, Handshake, CheckCircle2 } from 'lucide-react';
import { dummyServices } from '@/data/services';
import { ROUTES } from '@/routes/routes';
import ContactCTA from '@/components/landing/ContactCTA';

const ICONS = [Scale, FileText, Users, Heart, Search, Handshake];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-soft">
        <div className="pointer-events-none absolute -top-24 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-32 sm:pt-36">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium text-secondary"
          >
            What we do
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"
          >
            Our <span className="text-brand-gradient">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            Our services cover legal and regulatory research, compliance, contractual
            documentation, labour relations, human rights, policy and dispute-related
            advisory support. The scope of each engagement depends on the issue, the
            client's needs and the services the company is able to provide.
          </motion.p>
        </div>
      </section>

      {/* Service cards */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dummyServices.map((service, i) => {
            const Icon = ICONS[i] ?? Scale;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-glow"
              >
                {/* Gold top accent */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gold-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="flex flex-1 flex-col p-7">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/8 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold leading-snug tracking-tight">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {service.intro}
                  </p>

                  {/* Areas preview — first 3 */}
                  <ul className="mt-5 space-y-2">
                    {service.areas.slice(0, 3).map((area) => (
                      <li key={area} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                        {area}
                      </li>
                    ))}
                    {service.areas.length > 3 && (
                      <li className="text-xs text-muted-foreground/60 pl-6">
                        +{service.areas.length - 3} more areas
                      </li>
                    )}
                  </ul>

                  <Link
                    to={ROUTES.SERVICE_DETAIL(service.slug)}
                    className="mt-auto pt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition hover:gap-2.5"
                  >
                    View full details <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
