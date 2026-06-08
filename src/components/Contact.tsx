import { useRef, useEffect, useState } from 'react';
import { ArrowUpRight, Mail, Phone, MessageCircle, Send, Instagram, Youtube, Music } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sanitizeContactForm } from '../lib/sanitize';
import { buildWhatsAppUrl, checkRateLimit } from '../lib/whatsapp';
import { CONTACT_RATE_LIMIT_MS } from '../lib/config';

const EVENT_TYPES_OPT = [
  'Corporate Event', 'Wedding', 'Private Party', 'Club Night',
  'Festival', 'Award Night', 'Product Launch', 'Other',
];

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  venue: string;
  city: string;
  budget: string;
  message: string;
}

const EMPTY: BookingForm = {
  name: '', email: '', phone: '', event_type: '',
  event_date: '', venue: '', city: '', budget: '', message: '',
};

const SOCIALS = [
  { icon: Instagram, label: 'Instagram', handle: '@bhaswatisengupta', href: '#' },
  { icon: Youtube,   label: 'YouTube',   handle: 'Bhaswati Sengupta', href: '#' },
  { icon: Music,     label: 'Spotify',   handle: 'Bhaswati Sengupta', href: '#' },
];

const fieldClass =
  'w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-5 py-4 font-inter text-base text-white placeholder-white/25 focus:outline-none focus:border-[#4FC3F7]/50 transition-colors duration-200';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm]     = useState<BookingForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<BookingForm>>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.reveal, .line-clip').forEach((item, i) => {
          setTimeout(() => item.classList.add('is-visible'), i * 90);
        });
        obs.disconnect();
      }
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function validate(d: BookingForm): Partial<BookingForm> {
    const e: Partial<BookingForm> = {};
    if (!d.name.trim())    e.name = 'Name is required';
    if (!d.message.trim()) e.message = 'Tell us about the event';
    return e;
  }

  const set = (field: keyof BookingForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!checkRateLimit(CONTACT_RATE_LIMIT_MS)) {
      setErrors({ message: 'Please wait a moment before submitting again.' });
      return;
    }

    const clean = sanitizeContactForm({
      name: form.name, email: form.email,
      phone: form.phone, message: `[${form.event_type}] ${form.event_date} @ ${form.venue}, ${form.city} | Budget: ${form.budget}\n\n${form.message}`,
    });
    setStatus('saving');

    try {
      const { error } = await supabase.from('contact_submissions').insert([clean]);
      if (error) throw error;
      setStatus('success');
      setForm(EMPTY);
      setErrors({});
      window.open(buildWhatsAppUrl(clean), '_blank', 'noopener,noreferrer');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="booking" ref={sectionRef} className="relative z-20 py-24 md:py-36 px-8 md:px-16 border-t border-white/[0.06] overflow-hidden">

      {/* Ghost text */}
      <div className="absolute inset-x-0 bottom-0 font-clash font-bold text-[14vw] leading-none text-white/[0.02] select-none pointer-events-none text-center" style={{ letterSpacing: '-0.04em' }} aria-hidden>BOOK NOW</div>

      <div className="max-w-[1400px] mx-auto relative">
        <div className="reveal mb-6">
          <span className="font-inter text-[11px] text-[#4FC3F7] tracking-[0.3em] uppercase">09 — Booking</span>
        </div>
        <div className="line-clip mb-3">
          <span className="font-clash font-bold text-section text-white block">Book Bhaswati</span>
        </div>
        <div className="line-clip mb-14" style={{ transitionDelay: '0.08s' }}>
          <span className="font-clash font-bold text-section block">
            <span style={{ color: '#4FC3F7' }}>Sengupta</span><span className="text-white">.</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-24">

          {/* ── Booking Form ── */}
          <div className="reveal">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Name */}
              <div>
                <input type="text" placeholder="Your Name *" value={form.name} onChange={set('name')} className={fieldClass} style={{ backdropFilter: 'blur(8px)' }} />
                {errors.name && <p className="mt-1.5 font-inter text-[12px] text-red-400">{errors.name}</p>}
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="email" placeholder="Email Address" value={form.email} onChange={set('email')} className={fieldClass} style={{ backdropFilter: 'blur(8px)' }} />
                <input type="tel" placeholder="Phone / WhatsApp" value={form.phone} onChange={set('phone')} className={fieldClass} style={{ backdropFilter: 'blur(8px)' }} />
              </div>

              {/* Event Type */}
              <select value={form.event_type} onChange={set('event_type')} className={fieldClass} style={{ backdropFilter: 'blur(8px)' }}>
                <option value="" style={{ background: '#111' }}>Event Type</option>
                {EVENT_TYPES_OPT.map(t => <option key={t} value={t} style={{ background: '#111' }}>{t}</option>)}
              </select>

              {/* Date + Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="date" value={form.event_date} onChange={set('event_date')} className={fieldClass} style={{ backdropFilter: 'blur(8px)', colorScheme: 'dark' }} />
                <input type="text" placeholder="Venue Name" value={form.venue} onChange={set('venue')} className={fieldClass} style={{ backdropFilter: 'blur(8px)' }} />
              </div>

              {/* City + Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="City" value={form.city} onChange={set('city')} className={fieldClass} style={{ backdropFilter: 'blur(8px)' }} />
                <input type="text" placeholder="Approximate Budget (₹)" value={form.budget} onChange={set('budget')} className={fieldClass} style={{ backdropFilter: 'blur(8px)' }} />
              </div>

              {/* Message */}
              <div>
                <textarea placeholder="Tell us about your event *" value={form.message} onChange={set('message')} rows={4} className={`${fieldClass} resize-none`} style={{ backdropFilter: 'blur(8px)' }} />
                {errors.message && <p className="mt-1.5 font-inter text-[12px] text-red-400">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={status === 'saving'}
                className="group w-full flex items-center justify-center gap-3 font-clash font-semibold text-base bg-white text-black px-8 py-5 rounded-full hover:bg-[#4FC3F7] transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_32px_rgba(79,195,247,0.35)]"
              >
                {status === 'saving' ? 'Sending…' : (
                  <>
                    <Send size={16} />
                    Send Booking Enquiry via WhatsApp
                    <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:rotate-45" />
                  </>
                )}
              </button>

              {status === 'success' && (
                <p className="font-inter text-[13px] text-green-400 text-center">Enquiry saved! WhatsApp is opening…</p>
              )}
              {status === 'error' && (
                <p className="font-inter text-[13px] text-red-400 text-center">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>

          {/* ── Contact Info ── */}
          <div className="reveal delay-200 flex flex-col justify-between gap-10">
            <div>
              <p className="font-inter text-base text-white/40 leading-relaxed mb-10">
                For bookings, enquiries, and collaborations — our manager is available 7 days a week. We respond to all enquiries within 24 hours.
              </p>

              {/* Direct contacts */}
              <div className="space-y-5 mb-10">
                {[
                  { icon: Mail, label: 'Email', value: 'bookings@bhaswatisengupta.com', href: 'mailto:bookings@bhaswatisengupta.com' },
                  { icon: Phone, label: 'Manager Direct', value: '+91 98765 43210', href: 'tel:+919876543210' },
                  { icon: MessageCircle, label: 'WhatsApp', value: '+91 98765 43210', href: 'https://wa.me/919876543210' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <a key={label} href={href}
                    className="group flex items-center gap-4 font-inter text-sm text-white/50 hover:text-white transition-colors duration-300">
                    <span className="w-10 h-10 rounded-full border border-white/[0.10] flex items-center justify-center group-hover:border-[#4FC3F7]/60 group-hover:text-[#4FC3F7] transition-all duration-300"
                      style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.03)' }}>
                      <Icon size={15} />
                    </span>
                    <div>
                      <p className="font-inter text-[11px] text-white/25 uppercase tracking-widest">{label}</p>
                      <p className="font-inter text-sm text-white/60 group-hover:text-white transition-colors">{value}</p>
                    </div>
                    <ArrowUpRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>

              {/* Socials */}
              <p className="font-inter text-[11px] text-white/20 tracking-widest uppercase mb-5">Follow</p>
              <div className="flex flex-col gap-4">
                {SOCIALS.map(({ icon: Icon, label, handle, href }) => (
                  <a key={label} href={href}
                    className="group flex items-center gap-4 font-inter text-sm text-white/40 hover:text-white transition-colors duration-300">
                    <span className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center group-hover:border-[#4FC3F7]/50 group-hover:text-[#4FC3F7] transition-all duration-300"
                      style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.02)' }}>
                      <Icon size={14} />
                    </span>
                    <div>
                      <p className="font-clash font-medium text-sm text-white/60 group-hover:text-white transition-colors">{label}</p>
                      <p className="font-inter text-[11px] text-white/25">{handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-5 rounded-2xl border border-[#4FC3F7]/15" style={{ background: 'rgba(79,195,247,0.05)' }}>
              <span className="w-2.5 h-2.5 rounded-full bg-[#4FC3F7] animate-pulse flex-shrink-0" />
              <span className="font-inter text-sm text-white/50">
                <strong className="text-white font-medium">Taking bookings for 2025–2026.</strong> Slots fill up fast — enquire early.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
