import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import logo from '@/assets/logo.jpg';

const NAV_COL = [
  { label: 'About Us', to: ROUTES.ABOUT },
  { label: 'Services', to: ROUTES.SERVICES },
  { label: 'Insights', to: ROUTES.INSIGHTS },
  { label: 'Contact', to: ROUTES.CONTACT },
];

const LEGAL_COL = [
  { label: 'Privacy Notice', to: ROUTES.PRIVACY },
  { label: 'Disclaimer', to: ROUTES.DISCLAIMER },
];

const CONTACT_ITEMS = [
  { icon: Mail, label: 'info@adqs.co.za', href: 'mailto:info@adqs.co.za' },
  { icon: Phone, label: '+27 (0) 00 000 0000', href: 'tel:+27000000000' },
  { icon: MapPin, label: 'South Africa', href: '#' },
];

function FooterCol({
  title,
  links,
  delay = 0,
}: {
  title: string;
  links: { label: string; to: string }[];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
    >
      <h4 className="text-sm font-semibold text-primary-foreground">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map(({ label, to }, i) => (
          <motion.li
            key={label}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: delay + 0.08 + i * 0.05 }}
          >
            <Link
              to={to}
              className="text-sm text-white/60 transition hover:text-white"
            >
              {label}
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Footer() {
  return (
    <>
      {/* Wave divider */}
      <div className="relative -mb-px h-16 overflow-hidden">
        <svg className="absolute bottom-0 h-full w-full" viewBox="0 0 1440 64" preserveAspectRatio="none" fill="none">
          <path d="M0 64L1440 64L1440 0C1440 0 1080 48 720 48C360 48 0 0 0 0L0 64Z" className="fill-primary" />
        </svg>
      </div>

      <footer className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-6 pt-12 pb-8">
          <div className="grid gap-10 lg:grid-cols-12">

            {/* Brand column */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              <img src={logo} alt="Adequate Strategies Legal Consulting" className="h-12 w-auto object-contain" />
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                Practical legal solutions for businesses, institutions and individuals across South Africa.
                Research-informed. Results-focused.
              </p>
              <Link
                to={ROUTES.CONTACT}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground shadow-gold transition hover:opacity-90"
              >
                Make an Enquiry
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Nav columns */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
              <FooterCol title="Company" links={NAV_COL} delay={0.15} />
              <FooterCol title="Legal" links={LEGAL_COL} delay={0.25} />

              {/* Contact column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                <h4 className="text-sm font-semibold text-primary-foreground">Contact</h4>
                <ul className="mt-4 space-y-2.5">
                  {CONTACT_ITEMS.map(({ icon: Icon, label, href }, i) => (
                    <motion.li
                      key={label}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.4, delay: 0.35 + 0.08 + i * 0.05 }}
                    >
                      <a href={href} className="flex items-center gap-2 text-sm text-white/60 transition hover:text-white">
                        <Icon className="h-3.5 w-3.5 shrink-0 text-secondary" />
                        {label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Company registration */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 border-t border-white/10 pt-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-white/50">
                <span className="font-medium text-white/70">Adequate Strategies (Pty) Ltd</span>
                {' '}• Reg No: [Registration Number] • Registered in South Africa
              </p>
              <p className="text-xs text-white/50">
                © {new Date().getFullYear()} Adequate Strategies (Pty) Ltd. All rights reserved.
              </p>
            </div>
          </motion.div>
        </div>
      </footer>
    </>
  );
}
