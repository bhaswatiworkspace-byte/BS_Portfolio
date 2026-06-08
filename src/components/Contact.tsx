import { useRef, useEffect, useState } from 'react';
import { ArrowUpRight, Mail, Github, Linkedin, Twitter, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sanitizeContactForm } from '../lib/sanitize';
import { buildWhatsAppUrl, checkRateLimit } from '../lib/whatsapp';
import { CONTACT_RATE_LIMIT_MS } from '../lib/config';
import type { ContactFormData } from '../types';

const EMPTY: ContactFormData = { name: '', email: '', phone: '', message: '' };

const SOCIALS = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Twitter, label: 'Twitter / X', href: '#' },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState<ContactFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.reveal, .line-clip').forEach((item, i) => {
          setTimeout(() => item.classList.add('is-visible'), i * 110);
        });
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function validate(data: ContactFormData): Partial<ContactFormData> {
    const e: Partial<ContactFormData> = {};
    if (!data.name.trim()) e.name = 'Name is required';
    if (!data.message.trim()) e.message = 'Message is required';
    return e;
  }

  const set = (field: keyof ContactFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!checkRateLimit(CONTACT_RATE_LIMIT_MS)) {
      setErrors({ message: 'Please wait a moment before submitting again.' });
      return;
    }

    const clean = sanitizeContactForm(form);
    setStatus('saving');

    try {
      const { error } = await supabase.from('contact_submissions').insert([clean]);
      if (error) throw error;
      setStatus('success');
      setForm(EMPTY);
      setErrors({});
      // Open WhatsApp
      window.open(buildWhatsAppUrl(clean), '_blank', 'noopener,noreferrer');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="relative z-20 py-24 md:py-36 px-8 md:px-12 border-t border-white/[0.06] overflow-hidden">
      {/* Ghost background text */}
      <div className="absolute inset-x-0 bottom-0 font-clash font-bold text-[18vw] leading-none text-white/[0.025] select-none pointer-events-none text-center" style={{ letterSpacing: '-0.04em' }} aria-hidden>CONTACT</div>

      <div className="max-w-[1400px] mx-auto relative">
        <div className="reveal mb-6">
          <span className="font-inter text-label-sm text-accent tracking-[0.25em] uppercase">04 — Contact</span>
        </div>
        <div className="line-clip mb-3">
          <span className="font-clash font-bold text-section text-white block">Let's Work</span>
        </div>
        <div className="line-clip mb-16" style={{ transitionDelay: '0.1s' }}>
          <span className="font-clash font-bold text-section block">
            <span className="text-accent">Together</span><span className="text-white">.</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* ── Form ── */}
          <div className="reveal">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Name */}
              <div>
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={form.name}
                  onChange={set('name')}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-5 py-4 font-inter text-base text-white placeholder-white/25 focus:outline-none focus:border-white/30 transition-colors duration-200"
                  style={{ backdropFilter: 'blur(8px)' }}
                />
                {errors.name && <p className="mt-1.5 font-inter text-label-sm text-red-400">{errors.name}</p>}
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={set('email')}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-5 py-4 font-inter text-base text-white placeholder-white/25 focus:outline-none focus:border-white/30 transition-colors duration-200"
                  style={{ backdropFilter: 'blur(8px)' }}
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={form.phone}
                  onChange={set('phone')}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-5 py-4 font-inter text-base text-white placeholder-white/25 focus:outline-none focus:border-white/30 transition-colors duration-200"
                  style={{ backdropFilter: 'blur(8px)' }}
                />
              </div>

              {/* Message */}
              <div>
                <textarea
                  placeholder="Tell me about your project *"
                  value={form.message}
                  onChange={set('message')}
                  rows={6}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-5 py-4 font-inter text-base text-white placeholder-white/25 focus:outline-none focus:border-white/30 transition-colors duration-200 resize-none"
                  style={{ backdropFilter: 'blur(8px)' }}
                />
                {errors.message && <p className="mt-1.5 font-inter text-label-sm text-red-400">{errors.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'saving'}
                className="group w-full flex items-center justify-center gap-3 font-clash font-semibold text-base bg-white text-black px-8 py-5 rounded-full hover:bg-accent transition-colors duration-300 disabled:opacity-50"
              >
                {status === 'saving' ? 'Sending…' : (
                  <>
                    <Send size={16} />
                    Send via WhatsApp
                    <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:rotate-45" />
                  </>
                )}
              </button>

              {status === 'success' && (
                <p className="font-inter text-label-sm text-green-400 text-center">Message saved! WhatsApp is opening…</p>
              )}
              {status === 'error' && (
                <p className="font-inter text-label-sm text-red-400 text-center">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>

          {/* ── Info ── */}
          <div className="reveal delay-200 flex flex-col justify-between gap-12">
            <div>
              <p className="font-inter text-xl-body text-white/40 leading-relaxed mb-10 max-w-sm">
                I'm always open to new opportunities, creative collaborations, or just a great conversation about design and tech.
              </p>
              <div className="mb-2">
                <p className="font-inter text-label-sm text-white/20 tracking-widest uppercase mb-4">Email</p>
                <a href="mailto:bhaswati@example.com"
                  className="font-clash font-semibold text-xl text-white hover:text-accent transition-colors duration-300 flex items-center gap-2">
                  <Mail size={16} />
                  bhaswati@example.com
                </a>
              </div>
            </div>

            <div>
              <p className="font-inter text-label-sm text-white/20 tracking-widest uppercase mb-6">Social</p>
              <div className="flex flex-col gap-4">
                {SOCIALS.map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href}
                    className="group flex items-center gap-4 font-inter text-base text-white/40 hover:text-white transition-colors duration-300">
                    <span className="w-9 h-9 rounded-full border border-white/[0.1] flex items-center justify-center group-hover:border-accent group-hover:text-accent transition-all duration-300"
                      style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.03)' }}>
                      <Icon size={14} />
                    </span>
                    {label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-inter text-label-sm text-white/35">Available for freelance — respond in 24h</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
