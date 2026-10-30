import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import logo from '@/assets/logo.jpg';

const NAV = [
  { label: 'About', to: ROUTES.ABOUT },
  { label: 'Services', to: ROUTES.SERVICES },
  { label: 'Insights', to: ROUTES.INSIGHTS },
  { label: 'Contact', to: ROUTES.CONTACT },
  { label: 'Privacy Notice', to: ROUTES.PRIVACY },
  { label: 'Disclaimer', to: ROUTES.DISCLAIMER },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-white/10">
          {/* Logo + tagline */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="ADQS" className="h-10 w-auto object-contain rounded" />
            <div>
              <p className="text-sm font-semibold leading-tight">Adequate Strategies</p>
              <p className="text-xs text-white/50">Legal Consulting</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 text-xs text-white/50">
          {/* Contact line */}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5">
            <a href="mailto:info@adqs.co.za" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-brand-secondary" /> info@adqs.co.za
            </a>
            <a href="tel:+27178190000" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-brand-secondary" /> +27 17 819 0000
            </a>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-secondary" /> Ermelo, Mpumalanga
            </span>
          </div>

          {/* Copyright */}
          <p>© {new Date().getFullYear()} Adequate Strategies (Pty) Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
