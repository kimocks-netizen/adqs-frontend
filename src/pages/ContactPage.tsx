import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, CheckCircle, Send } from 'lucide-react';
import { dummyServices } from '@/data/services';
import { ROUTES } from '@/routes/routes';

const AREAS = dummyServices.map((s) => s.title);

interface FormState {
  name: string;
  email: string;
  phone: string;
  organisation: string;
  area_of_enquiry: string;
  message: string;
}

const EMPTY: FormState = {
  name: '',
  email: '',
  phone: '',
  organisation: '',
  area_of_enquiry: '',
  message: '',
};

const INFO = [
  {
    icon: MapPin,
    label: 'Office',
    value: '23 Joubert Street, Ermelo, Mpumalanga, 2350',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+27 17 819 0000',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@adqs.co.za',
  },
  {
    icon: Clock,
    label: 'Office Hours',
    value: 'Mon – Fri: 08:00 – 17:00',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.email.trim()) e.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.area_of_enquiry) e.area_of_enquiry = 'Please select an area of enquiry.';
    if (!form.message.trim()) e.message = 'Please describe your enquiry.';
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    // Dummy delay — replace with real API call in Phase 14
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const inputClass = (field: keyof FormState) =>
    `w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
      errors[field]
        ? 'border-red-400 focus:ring-red-200'
        : 'border-gray-200 focus:ring-brand-primary/20 focus:border-brand-primary/50'
    }`;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-brand-gradient pt-32 pb-16 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold tracking-widest uppercase text-yellow-300 mb-3"
          >
            Get in Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 max-w-xl text-lg"
          >
            Reach out to discuss your matter. We respond to all enquiries within one business day.
          </motion.p>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-[1fr_340px] gap-12 items-start">

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-card p-8"
        >
          <h2 className="text-xl font-bold text-brand-primary mb-1">Make an Enquiry</h2>
          <p className="text-sm text-gray-500 mb-7">All fields marked * are required.</p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-12 gap-4"
              >
                <CheckCircle className="w-14 h-14 text-green-500" />
                <h3 className="text-xl font-bold text-brand-primary">Enquiry Received</h3>
                <p className="text-gray-500 max-w-sm text-sm">
                  Thank you, {form.name.split(' ')[0]}. We'll be in touch within one business day.
                </p>
                <button
                  onClick={() => { setForm(EMPTY); setSubmitted(false); }}
                  className="mt-2 text-sm text-brand-secondary font-semibold hover:underline"
                >
                  Submit another enquiry
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
              >
                {/* Row 1 */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Thabo Mokoena"
                      className={inputClass('name')}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={inputClass('email')}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+27 82 000 0000"
                      className={inputClass('phone')}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Organisation</label>
                    <input
                      name="organisation"
                      value={form.organisation}
                      onChange={handleChange}
                      placeholder="Company / Organisation name"
                      className={inputClass('organisation')}
                    />
                  </div>
                </div>

                {/* Area of enquiry */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Area of Enquiry *</label>
                  <select
                    name="area_of_enquiry"
                    value={form.area_of_enquiry}
                    onChange={handleChange}
                    className={inputClass('area_of_enquiry') + ' bg-white'}
                  >
                    <option value="">Select a service area…</option>
                    {AREAS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                    <option value="General Enquiry">General Enquiry</option>
                  </select>
                  {errors.area_of_enquiry && <p className="text-xs text-red-500 mt-1">{errors.area_of_enquiry}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Briefly describe your matter or question…"
                    className={inputClass('message') + ' resize-none'}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>

                <p className="text-xs text-gray-400">
                  By submitting this form you agree to our{' '}
                  <a href="/privacy" className="underline hover:text-brand-primary">Privacy Policy</a>.
                  This form does not create an attorney-client relationship.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-brand-gradient text-white text-sm font-bold px-7 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {loading ? 'Sending…' : 'Send Enquiry'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info panel */}
        <aside className="space-y-6 lg:sticky lg:top-28">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-soft rounded-2xl p-7 space-y-6"
          >
            <h3 className="text-base font-bold text-brand-primary">Contact Information</h3>
            {INFO.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-sm text-brand-primary font-medium mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl overflow-hidden shadow-card h-52 bg-gray-100 relative"
          >
            <iframe
              title="ADQS Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3588.0!2d29.9833!3d-26.5167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDMxJzAwLjAiUyAyOcKwNTknMDAuMCJF!5e0!3m2!1sen!2sza!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

        </aside>
      </div>
      {/* Bottom CTA strip */}
      <section className="relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-gradient opacity-90" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 py-20 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            Ready to get practical legal guidance?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg mb-8 max-w-xl mx-auto"
          >
            Tell us about your situation and we'll respond with clarity on how we can help — no jargon, no obligation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to={ROUTES.CONTACT}
              className="inline-block bg-brand-secondary text-white font-bold px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity shadow-gold"
            >
              Make an Enquiry
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
