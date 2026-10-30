import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';

const SECTIONS = [
  {
    title: '1. Who we are',
    body: `Adequate Strategies (Pty) Ltd ("ADQS", "we", "us", "our") is a legal consulting and advisory practice registered in South Africa. We operate the website at adqs.co.za and provide legal consulting, compliance advisory, and related services.\n\nFor purposes of the Protection of Personal Information Act 4 of 2013 (POPIA), ADQS is the responsible party in respect of personal information collected through this website.`,
  },
  {
    title: '2. What personal information we collect',
    body: `We may collect the following categories of personal information:\n\n- Full name\n- Email address\n- Phone number\n- Organisation or employer name\n- The nature of your legal or compliance enquiry\n- Any other information you voluntarily provide through our contact form or correspondence\n\nWe do not collect sensitive personal information (as defined in POPIA) through this website unless you voluntarily disclose it in the course of an enquiry.`,
  },
  {
    title: '3. Why we collect your information',
    body: `We collect and process your personal information for the following purposes:\n\n- To respond to your enquiry or request for information\n- To assess whether and how we may be able to assist you\n- To communicate with you about our services\n- To comply with our legal and regulatory obligations\n- To improve our website and services\n\nWe process your personal information on the basis of your consent (by submitting our contact form) and, where applicable, our legitimate interest in responding to enquiries about our services.`,
  },
  {
    title: '4. How we store and protect your information',
    body: `We take reasonable technical and organisational measures to protect your personal information against loss, damage, unauthorised access, disclosure or destruction. Our website is hosted on secure infrastructure and access to personal information is restricted to authorised personnel only.\n\nPersonal information submitted through our contact form is retained for as long as is necessary to respond to your enquiry and for a reasonable period thereafter, unless a longer retention period is required by law.`,
  },
  {
    title: '5. Sharing of personal information',
    body: `We do not sell, rent or trade your personal information to third parties. We may share your information with:\n\n- Service providers who assist us in operating our website or delivering our services, subject to appropriate data processing agreements\n- Regulatory authorities or law enforcement agencies where required by law\n\nWe will not share your personal information with any other third party without your consent, unless required to do so by law.`,
  },
  {
    title: '6. Your rights under POPIA',
    body: `As a data subject, you have the following rights under POPIA:\n\n- The right to be notified that your personal information is being collected\n- The right to access your personal information held by us\n- The right to request correction of inaccurate or incomplete information\n- The right to request deletion of your personal information in certain circumstances\n- The right to object to the processing of your personal information\n- The right to lodge a complaint with the Information Regulator\n\nTo exercise any of these rights, please contact us at the details below.`,
  },
  {
    title: '7. Cookies',
    body: `Our website may use cookies and similar technologies to improve your browsing experience and to analyse website traffic. You may configure your browser to refuse cookies, although this may affect the functionality of certain parts of the website.`,
  },
  {
    title: '8. Third-party links',
    body: `Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites and encourage you to review their privacy policies before providing any personal information.`,
  },
  {
    title: '9. Contact us',
    body: `If you have any questions about this Privacy Notice or wish to exercise your rights, please contact us:\n\nAdequate Strategies (Pty) Ltd\nEmail: info@adqs.co.za\nPhone: +27 17 819 0000\nAddress: 23 Joubert Street, Ermelo, Mpumalanga, 2350\n\nYou may also lodge a complaint with the Information Regulator of South Africa at inforeg.org.za.`,
  },
  {
    title: '10. Updates to this notice',
    body: `We may update this Privacy Notice from time to time. The date of the most recent revision will be indicated at the top of this page. We encourage you to review this notice periodically.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-brand-gradient pt-32 pb-14 text-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold tracking-widest uppercase text-yellow-300 mb-3"
          >
            Legal
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold mb-3"
          >
            Privacy Notice
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-sm"
          >
            Last updated: January 2025
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-14">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-600 leading-relaxed mb-10 text-base border-l-4 border-brand-secondary pl-5"
        >
          This Privacy Notice explains how Adequate Strategies (Pty) Ltd collects, uses, stores and protects
          your personal information in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA).
          Please read this notice carefully before submitting any personal information through this website.
        </motion.p>

        <div className="space-y-10">
          {SECTIONS.map(({ title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <h2 className="text-lg font-bold text-brand-primary mb-3">{title}</h2>
              <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{body}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Adequate Strategies (Pty) Ltd. All rights reserved.</p>
          <Link to={ROUTES.DISCLAIMER} className="text-sm text-brand-secondary font-semibold hover:underline">
            View Disclaimer →
          </Link>
        </div>
      </div>
    </div>
  );
}
