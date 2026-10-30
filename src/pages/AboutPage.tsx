import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Globe,
  Scale,
  BookOpen,
  Users,
} from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import ceoImg from '@/assets/bright-ceo.jpg';
import heroImg from '@/assets/law-final-judge.png';
import ContactCTA from '@/components/landing/ContactCTA';

// ─── Data ────────────────────────────────────────────────────────────────────

const PRINCIPLES = [
  {
    title: 'Clarity',
    desc: 'Complex legal and regulatory information explained in accessible, plain language.',
  },
  {
    title: 'Practicality',
    desc: 'Recommendations focused on what can actually be applied in your circumstances.',
  },
  {
    title: 'Integrity',
    desc: 'Honest, independent counsel — including clear acknowledgement of scope and limitations.',
  },
  {
    title: 'Research',
    desc: 'Every analysis is grounded in relevant sources, legislation and evidence.',
  },
  {
    title: 'Accessibility',
    desc: 'Legal guidance that helps clients understand their obligations, rights and options.',
  },
  {
    title: 'Responsibility',
    desc: 'Personal information and confidential matters handled with appropriate care.',
  },
];

const APPROACH_STEPS = [
  {
    num: '01',
    title: 'Understand the issue',
    desc: "We begin by listening carefully to understand the situation, the client's objectives and the relevant context.",
  },
  {
    num: '02',
    title: 'Identify risks & obligations',
    desc: 'We research the applicable legal and regulatory framework and identify the key risks, obligations and options.',
  },
  {
    num: '03',
    title: 'Explain in plain language',
    desc: 'We present our analysis clearly — without unnecessary jargon — so clients can make informed decisions.',
  },
  {
    num: '04',
    title: 'Deliver practical support',
    desc: 'We provide documentation, guidance or advisory support tailored to the agreed scope of the engagement.',
  },
];

const CREDENTIALS = [
  { icon: GraduationCap, label: 'LLB — University of the Witwatersrand, Johannesburg' },
  { icon: Briefcase, label: 'Programmes Officer — SADC Lawyers Association' },
  { icon: Globe, label: 'Regional legal research across six SADC countries' },
  { icon: Scale, label: 'Commercial litigation research & civil procedure' },
  { icon: BookOpen, label: 'Policy development & legislative analysis' },
  { icon: Users, label: 'Access-to-justice & pro bono initiatives' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PageHero() {
  return (
    <section className="relative overflow-hidden h-[60vh] min-h-[420px] flex items-end">
      {/* Background image */}
      <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-32 w-full">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-semibold tracking-widest uppercase text-yellow-300 mb-3"
        >
          Who we are
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl text-white mb-4"
        >
          About Adequate Strategies Legal Consulting
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="max-w-2xl text-lg leading-relaxed text-white/80"
        >
          Practical, research-informed legal and compliance consulting for individuals,
          businesses and organisations across South Africa.
        </motion.p>
      </div>
    </section>
  );
}

function CompanyOverview() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      {/* Heading above both columns */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <p className="text-sm font-medium text-secondary">Our story</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Research-led. Results-focused.
        </h2>
      </motion.div>

      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        {/* Left — body text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="space-y-4 leading-relaxed text-muted-foreground text-justify">
            <p>
              Adequate Strategies Legal Consulting is the public-facing consulting and
              advisory practice of Adequate Strategies (Pty) Ltd. We support individuals,
              entrepreneurs, businesses, employers, civil-society organisations and other
              institutions with practical, research-informed work across legal analysis,
              compliance, contracts, labour relations, human rights, policy and governance.
            </p>
            <p>
              Our work is guided by the belief that sound decisions begin with a clear
              understanding of the applicable rules, the risks involved and the options
              available. We aim to make complex legal and regulatory issues easier to
              understand and to provide support that is practical, responsive and
              appropriate to the client's circumstances.
            </p>
            <p>
              We focus on early risk identification, sound documentation, informed
              decision-making and access to reliable legal information. Where a matter
              requires services outside our scope, appropriate referral pathways may
              be considered.
            </p>
          </div>
        </motion.div>

        {/* Right — stats cards, aligned to top of paragraph text */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { k: '6', v: 'Service areas', sub: 'Compliance to dispute resolution' },
            { k: 'SA', v: 'Based in South Africa', sub: 'Serving clients nationally' },
            { k: 'LLB', v: 'Qualified founder', sub: 'University of the Witwatersrand' },
            { k: '100%', v: 'Research-informed', sub: 'Evidence-based analysis' },
          ].map(({ k, v, sub }, i) => (
            <motion.div
              key={v}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gold-gradient opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="text-3xl font-bold tracking-tight text-brand-gradient">{k}</div>
              <div className="mt-1 text-sm font-semibold">{v}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrinciplesSection() {
  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-medium text-secondary">How we work</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            The principles that guide us
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map(({ title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
              <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FounderProfile() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <p className="text-sm font-medium text-secondary">Leadership</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Meet the founder
        </h2>
      </motion.div>

      <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-4"
        >
          <div className="relative mx-auto max-w-xs lg:max-w-none">
            <div className="absolute -inset-4 rounded-3xl bg-brand-gradient opacity-10 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-border shadow-glow">
              <img
                src={ceoImg}
                alt="Bright Ngwenyama Gunde — Founder & Principal Consultant"
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gold-gradient" />
            </div>
            {/* Name card below photo */}
            <div className="mt-4 rounded-xl border border-border bg-card p-4 shadow-card text-center">
              <p className="font-semibold">Bright Ngwenyama Gunde</p>
              <p className="mt-0.5 text-sm text-muted-foreground">Founder & Principal Consultant</p>
              <p className="mt-0.5 text-xs text-secondary font-medium">LLB — University of the Witwatersrand</p>
            </div>
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-8"
        >
          <div className="space-y-4 leading-relaxed text-muted-foreground text-justify">
            <p>
              Bright Ngwenyama Gunde holds an LLB degree from the University of the
              Witwatersrand, Johannesburg. His professional background spans legal research
              and analysis, policy development, labour and employment law, legal and
              regulatory compliance, human rights, access to justice, governance and
              programme management.
            </p>
            <p>
              His professional background includes experience across national, regional and
              international environments, working at the intersection of law, civil society,
              government and international development. He previously served as Programmes
              Officer in Policy Research and Advocacy at the SADC Lawyers Association,
              where his work included regional legal research, advocacy initiatives,
              programme coordination, policy development and institutional capacity building.
            </p>
            <p>
              His broader background includes contributions to regional pro bono legal-services
              initiatives, research on freedom of association and assembly across six SADC
              countries, policy discussions, judicial reform and access-to-justice initiatives,
              and regional legal analysis relating to petty offences.
            </p>
            <p>
              As Director of Adequate Strategies Legal Consulting, Bright's focus is to lead
              a research-driven advisory practice that helps clients address legal, compliance,
              policy and institutional challenges through practical, context-sensitive analysis
              and support.
            </p>
          </div>

          {/* Credentials grid */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {CREDENTIALS.map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm shadow-card"
              >
                <Icon className="h-4 w-4 shrink-0 text-secondary" />
                <span className="text-muted-foreground">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ApproachSection() {
  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-medium text-secondary">Our process</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            How we approach every engagement
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {APPROACH_STEPS.map(({ num, title, desc }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl border border-border bg-card p-7 shadow-card"
            >
              {/* Connector line (desktop) */}
              {i < APPROACH_STEPS.length - 1 && (
                <div className="absolute -right-3 top-10 hidden h-[2px] w-6 bg-border lg:block" />
              )}
              <div className="text-3xl font-bold tracking-tight text-brand-gradient">{num}</div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link
            to={ROUTES.CONTACT}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
          >
            Start a conversation <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      <PageHero />
      <CompanyOverview />
      <PrinciplesSection />
      <FounderProfile />
      <ApproachSection />
      <ContactCTA />
    </>
  );
}
