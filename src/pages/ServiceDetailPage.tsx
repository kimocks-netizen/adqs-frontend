import { motion } from 'motion/react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2, Scale, FileText, Users, Heart, Search, Handshake } from 'lucide-react';
import { dummyServices } from '@/data/services';
import { ROUTES } from '@/routes/routes';

const ICONS = [Scale, FileText, Users, Heart, Search, Handshake];

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const idx = dummyServices.findIndex((s) => s.slug === slug);
  const service = dummyServices[idx];

  if (!service) return <Navigate to={ROUTES.SERVICES} replace />;

  const Icon = ICONS[idx] ?? Scale;

  // Related — other 2 services (prev + next, wrapping)
  const related = [
    dummyServices[(idx + 1) % dummyServices.length],
    dummyServices[(idx + 2) % dummyServices.length],
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-soft">
        <div className="pointer-events-none absolute -top-24 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-32 sm:pt-36">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Link to={ROUTES.HOME} className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to={ROUTES.SERVICES} className="hover:text-primary">Services</Link>
            <span>/</span>
            <span className="text-foreground">{service.title}</span>
          </motion.nav>

          <div className="mt-6 flex items-start gap-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow"
            >
              <Icon className="h-7 w-7" />
            </motion.div>
            <div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-sm font-medium text-secondary"
              >
                Service {service.display_order} of {dummyServices.length}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="mt-1 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
              >
                {service.title}
              </motion.h1>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-3">

          {/* Main content */}
          <div className="lg:col-span-2">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-lg leading-relaxed text-muted-foreground"
            >
              {service.intro}
            </motion.p>

            {/* Areas */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-10"
            >
              <h2 className="text-xl font-semibold tracking-tight">Potential areas include</h2>
              <ul className="mt-6 space-y-3">
                {service.areas.map((area, i) => (
                  <motion.li
                    key={area}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card px-5 py-3.5 shadow-card"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                    <span className="text-sm leading-relaxed">{area}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Disclaimer */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 text-xs leading-relaxed text-muted-foreground/70 border-t border-border pt-6"
            >
              The scope of each engagement depends on the issue, the client's needs and
              the services the company is able to provide. Where a matter falls outside
              our scope, appropriate referral pathways may be considered.
            </motion.p>
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="sticky top-24 rounded-2xl border border-border bg-card p-7 shadow-card"
            >
              <div className="h-1 w-12 rounded-full bg-gold-gradient mb-5" />
              <h3 className="font-semibold text-lg">Enquire about this service</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Tell us about your situation and we'll respond with clarity on how we
                can help — no jargon, no obligation.
              </p>
              <Link
                to={ROUTES.CONTACT}
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
              >
                Make an Enquiry <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={ROUTES.SERVICES}
                className="mt-3 flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" /> All Services
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related services */}
      <section className="bg-muted/40">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-xl font-semibold tracking-tight">Other services</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {related.map((rel, i) => {
              const RelIcon = ICONS[dummyServices.indexOf(rel)] ?? Scale;
              return (
                <motion.div
                  key={rel.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-glow"
                >
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gold-gradient opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/8 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <RelIcon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold leading-snug">{rel.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{rel.summary}</p>
                  <Link
                    to={ROUTES.SERVICE_DETAIL(rel.slug)}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition hover:gap-2.5"
                  >
                    View service <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
