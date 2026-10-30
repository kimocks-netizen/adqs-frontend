import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';

const SECTIONS = [
  {
    title: '1. Nature of services',
    body: `Adequate Strategies (Pty) Ltd ("ADQS") provides legal consulting, compliance advisory, research, and related services. ADQS is not a law firm and does not provide legal representation or appear in legal proceedings on behalf of clients.\n\nThe services provided by ADQS constitute legal consulting and advisory services. They do not constitute legal advice in the sense of advice provided by an admitted attorney in the context of an attorney-client relationship, unless expressly agreed otherwise in writing.`,
  },
  {
    title: '2. No attorney-client relationship',
    body: `Accessing this website, submitting an enquiry through our contact form, or receiving a response from ADQS does not create an attorney-client relationship. An engagement with ADQS is only established upon the conclusion of a written agreement setting out the agreed scope of services.\n\nUntil such an agreement is concluded, ADQS is under no obligation to provide services or to maintain the confidentiality of information shared with it.`,
  },
  {
    title: '3. General information only',
    body: `The content published on this website — including articles, insights, opinions, and service descriptions — is provided for general informational purposes only. It does not constitute legal advice on any specific matter and should not be relied upon as such.\n\nLegal and regulatory requirements change frequently. While we endeavour to keep our content accurate and up to date, we make no representations or warranties as to the accuracy, completeness or currency of any information on this website.`,
  },
  {
    title: '4. Limitation of liability',
    body: `To the fullest extent permitted by applicable law, ADQS, its directors, employees and consultants shall not be liable for any loss or damage — whether direct, indirect, consequential or otherwise — arising from:\n\n- Reliance on any information published on this website\n- Any error or omission in the content of this website\n- Any interruption or unavailability of this website\n- Any unauthorised access to or use of our servers or any personal information stored therein`,
  },
  {
    title: '5. Referrals',
    body: `Where a matter falls outside the scope of services that ADQS is able to provide, we may suggest that you seek assistance from an admitted attorney or other qualified professional. Any such suggestion does not constitute an endorsement of any particular practitioner or firm, and ADQS accepts no responsibility for the services provided by any third party to whom you may be referred.`,
  },
  {
    title: '6. Jurisdiction',
    body: `This website is operated from South Africa. The information on this website is intended for use by persons in South Africa and is governed by South African law. ADQS makes no representation that the content of this website is appropriate or available for use in other jurisdictions.`,
  },
  {
    title: '7. Intellectual property',
    body: `All content on this website — including text, graphics, logos, and articles — is the property of Adequate Strategies (Pty) Ltd and is protected by applicable intellectual property laws. You may not reproduce, distribute or republish any content from this website without our prior written consent.`,
  },
  {
    title: '8. Contact',
    body: `If you have any questions about this Disclaimer, please contact us:\n\nAdequate Strategies (Pty) Ltd\nEmail: info@adqs.co.za\nPhone: +27 17 819 0000\nAddress: 23 Joubert Street, Ermelo, Mpumalanga, 2350`,
  },
];

export default function DisclaimerPage() {
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
            Disclaimer
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
          Please read this Disclaimer carefully before using this website or engaging with Adequate Strategies (Pty) Ltd.
          By accessing this website you acknowledge that you have read, understood and agree to be bound by this Disclaimer.
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
          <Link to={ROUTES.PRIVACY} className="text-sm text-brand-secondary font-semibold hover:underline">
            View Privacy Notice →
          </Link>
        </div>
      </div>
    </div>
  );
}
