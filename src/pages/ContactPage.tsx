import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, CheckCircle, Send, ShieldCheck, X } from 'lucide-react';
import { dummyServices } from '@/data/services';
import { ROUTES } from '@/routes/routes';
import { contactApi } from '@/features/contact/api';

const AREAS = dummyServices.map((s) => s.title);

interface FormState {
  name: string;
  email: string;
  phone: string;
  organisation: string;
  area_of_enquiry: string;
  message: string;
}

const EMPTY: FormState = { name: '', email: '', phone: '', organisation: '', area_of_enquiry: '', message: '' };

const INFO = [
  { icon: MapPin, label: 'Office', value: '252 Cole Road, Shere, Pretoria, Gauteng, 0084' },
  { icon: Phone, label: 'Phone', value: '+27 66 023 0095' },
  { icon: Mail,  label: 'Email', value: 'info@adqs.co.za' },
  { icon: Clock, label: 'Office Hours', value: 'Mon – Fri: 08:00 – 17:00' },
];

type ModalStep = 'prompt' | 'sending' | 'enter' | 'verifying' | 'verified';

export default function ContactPage() {
  const [form, setForm]         = useState<FormState>(EMPTY);
  const [errors, setErrors]     = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // OTP modal
  const [showModal, setShowModal]   = useState(false);
  const [modalStep, setModalStep]   = useState<ModalStep>('prompt');
  const [otpCode, setOtpCode]       = useState('');
  const [otpError, setOtpError]     = useState('');
  const [cooldown, setCooldown]     = useState(0);
  const [emailVerified, setEmailVerified] = useState(false);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (cooldownRef.current) clearInterval(cooldownRef.current); }, []);

  function startCooldown() {
    setCooldown(60);
    cooldownRef.current = setInterval(() => {
      setCooldown((c) => { if (c <= 1) { clearInterval(cooldownRef.current!); return 0; } return c - 1; });
    }, 1000);
  }

  async function handleSendOtp() {
    setOtpError('');
    setModalStep('sending');
    try {
      await contactApi.sendOtp(form.email);
      setModalStep('enter');
      startCooldown();
    } catch (err: unknown) {
      setOtpError(err instanceof Error ? err.message : 'Failed to send code.');
      setModalStep('prompt');
    }
  }

  async function handleVerifyOtp() {
    if (otpCode.length !== 6) { setOtpError('Enter the 6-digit code.'); return; }
    setOtpError('');
    setModalStep('verifying');
    try {
      await contactApi.verifyOtp(form.email, otpCode);
      setModalStep('verified');
      setEmailVerified(true);
      // Auto-submit after short delay so user sees the verified state
      setTimeout(() => { setShowModal(false); doSubmit(true); }, 1200);
    } catch (err: unknown) {
      setModalStep('enter');
      setOtpError(err instanceof Error ? err.message : 'Incorrect code. Please try again.');
    }
  }

  function handleSkip() {
    setShowModal(false);
    doSubmit(false);
  }

  async function doSubmit(verified: boolean) {
    setSubmitting(true);
    try {
      await contactApi.submit({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        organisation: form.organisation || undefined,
        area_of_enquiry: form.area_of_enquiry,
        message: form.message,
        email_verified: verified,
      });
      setEmailVerified(verified);
      setSubmitted(true);
    } catch (err: unknown) {
      setErrors({ message: err instanceof Error ? err.message : 'Failed to submit. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

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

  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    // Open OTP modal
    setOtpCode('');
    setOtpError('');
    setModalStep('prompt');
    setShowModal(true);
  };

  const inputClass = (field: keyof FormState) =>
    `w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
      errors[field]
        ? 'border-red-400 focus:ring-red-200'
        : 'border-gray-200 focus:ring-brand-primary/20 focus:border-brand-primary/50'
    }`;

  return (
    <div className="min-h-screen bg-white">

      {/* OTP Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-7 relative"
            >
              {/* Close — only on prompt step */}
              {modalStep === 'prompt' && (
                <button onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}

              <AnimatePresence mode="wait">

                {/* Step: prompt */}
                {modalStep === 'prompt' && (
                  <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-brand-primary">Verify your email?</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        We'll send a 6-digit code to <strong>{form.email}</strong> to confirm it's correct.
                        Verified emails get a confirmation receipt.
                      </p>
                    </div>
                    {otpError && <p className="text-xs text-red-500">{otpError}</p>}
                    <button onClick={handleSendOtp}
                      className="w-full bg-brand-gradient text-white text-sm font-bold py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                      Send verification code
                    </button>
                    <button onClick={handleSkip}
                      className="w-full text-sm text-gray-400 hover:text-gray-600 py-1 underline">
                      Skip — send enquiry without verifying
                    </button>
                  </motion.div>
                )}

                {/* Step: sending */}
                {modalStep === 'sending' && (
                  <motion.div key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-3 py-6">
                    <span className="w-8 h-8 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Sending code to {form.email}…</p>
                  </motion.div>
                )}

                {/* Step: enter code */}
                {modalStep === 'enter' && (
                  <motion.div key="enter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-brand-primary">Enter verification code</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Code sent to <strong>{form.email}</strong>. Expires in 10 minutes.
                      </p>
                    </div>
                    <input
                      value={otpCode}
                      onChange={(e) => { setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setOtpError(''); }}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                    {otpError && <p className="text-xs text-red-500">{otpError}</p>}
                    <button onClick={handleVerifyOtp}
                      className="w-full bg-brand-gradient text-white text-sm font-bold py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                      Verify code
                    </button>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      {cooldown > 0
                        ? <span>Resend in {cooldown}s</span>
                        : <button onClick={handleSendOtp} className="hover:text-gray-600 underline">Resend code</button>
                      }
                      <button onClick={handleSkip} className="hover:text-gray-600 underline">Skip verification</button>
                    </div>
                  </motion.div>
                )}

                {/* Step: verifying */}
                {modalStep === 'verifying' && (
                  <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-3 py-6">
                    <span className="w-8 h-8 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Verifying…</p>
                  </motion.div>
                )}

                {/* Step: verified */}
                {modalStep === 'verified' && (
                  <motion.div key="verified" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 py-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                    <p className="text-base font-bold text-brand-primary">Email verified!</p>
                    <p className="text-sm text-gray-500">Submitting your enquiry…</p>
                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="bg-brand-gradient pt-32 pb-16 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold tracking-widest uppercase text-yellow-300 mb-3">
            Get in Touch
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold mb-4">
            Contact Us
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-white/80 max-w-xl text-lg">
            Reach out to discuss your matter. We respond to all enquiries within one business day.
          </motion.p>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-[1fr_340px] gap-12 items-start">

        {/* Form card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-card p-8">
          <h2 className="text-xl font-bold text-brand-primary mb-1">Make an Enquiry</h2>
          <p className="text-sm text-gray-500 mb-7">All fields marked * are required.</p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-12 gap-4">
                <CheckCircle className="w-14 h-14 text-green-500" />
                <h3 className="text-xl font-bold text-brand-primary">Enquiry Received</h3>
                <p className="text-gray-500 max-w-sm text-sm">
                  Thank you, {form.name.split(' ')[0]}.{' '}
                  {emailVerified
                    ? "We've sent a confirmation to your email. We'll be in touch within one business day."
                    : "We'll be in touch within one business day."}
                </p>
                <button onClick={() => { setForm(EMPTY); setSubmitted(false); setEmailVerified(false); }}
                  className="mt-2 text-sm text-brand-secondary font-semibold hover:underline">
                  Submit another enquiry
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onSubmit={handleSubmitClick} noValidate className="space-y-5">

                {/* Row 1 */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange}
                      placeholder="e.g. Thabo Mokoena" className={inputClass('name')} />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange}
                      placeholder="you@example.com" className={inputClass('email')} />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label>
                    <input name="phone" value={form.phone} onChange={handleChange}
                      placeholder="+27 82 000 0000" className={inputClass('phone')} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Organisation</label>
                    <input name="organisation" value={form.organisation} onChange={handleChange}
                      placeholder="Company / Organisation name" className={inputClass('organisation')} />
                  </div>
                </div>

                {/* Area of enquiry */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Area of Enquiry *</label>
                  <select name="area_of_enquiry" value={form.area_of_enquiry} onChange={handleChange}
                    className={inputClass('area_of_enquiry') + ' bg-white'}>
                    <option value="">Select a service area…</option>
                    {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                    <option value="General Enquiry">General Enquiry</option>
                  </select>
                  {errors.area_of_enquiry && <p className="text-xs text-red-500 mt-1">{errors.area_of_enquiry}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={5}
                    placeholder="Briefly describe your matter or question…"
                    className={inputClass('message') + ' resize-none'} />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>

                <p className="text-xs text-gray-400">
                  By submitting this form you agree to our{' '}
                  <a href="/privacy" className="underline hover:text-brand-primary">Privacy Policy</a>.
                  This form does not create an attorney-client relationship.
                </p>

                <button type="submit" disabled={submitting}
                  className="flex items-center gap-2 bg-brand-gradient text-white text-sm font-bold px-7 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60">
                  {submitting
                    ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    : <Send className="w-4 h-4" />}
                  {submitting ? 'Sending…' : 'Send Enquiry'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info panel */}
        <aside className="space-y-6 lg:sticky lg:top-28">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="bg-soft rounded-2xl p-7 space-y-6">
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

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
            className="rounded-2xl overflow-hidden shadow-card h-52 bg-gray-100">
            <iframe title="ADQS Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3588.0!2d29.9833!3d-26.5167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDMxJzAwLjAiUyAyOcKwNTknMDAuMCJF!5e0!3m2!1sen!2sza!4v1700000000000"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" />
          </motion.div>
        </aside>
      </div>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80" alt=""
            className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-brand-gradient opacity-90" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 py-20 text-center text-white">
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to get practical legal guidance?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }} className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Tell us about your situation and we'll respond with clarity on how we can help — no jargon, no obligation.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}>
            <Link to={ROUTES.CONTACT}
              className="inline-block bg-brand-secondary text-white font-bold px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity shadow-gold">
              Make an Enquiry
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
