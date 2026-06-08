import { useRef, useEffect } from 'react';
import { Download, FileText, Image, Mic } from 'lucide-react';

const PRESS_ITEMS = [
  { icon: FileText, label: 'Full Press Kit',   sub: 'PDF — bio, photos, rider', href: '#' },
  { icon: Image,    label: 'Hi-Res Photos',    sub: 'ZIP — 15 press images',    href: '#' },
  { icon: Mic,      label: 'Technical Rider',  sub: 'PDF — full stage plot',    href: '#' },
  { icon: FileText, label: 'Artist Bio',       sub: 'DOCX — short + full bio',  href: '#' },
];

export default function Press() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.reveal, .line-clip').forEach((item, i) => {
          setTimeout(() => item.classList.add('is-visible'), i * 80);
        });
        obs.disconnect();
      }
    }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="press" ref={sectionRef} className="relative z-20 py-24 px-8 md:px-16 border-t border-white/[0.06]">
      <div className="max-w-[1400px] mx-auto">
        <div className="reveal mb-6">
          <span className="font-inter text-[11px] text-[#4FC3F7] tracking-[0.3em] uppercase">Press Resources</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="line-clip">
            <span className="font-clash font-bold text-section text-white block">
              Press Kit<span style={{ color: '#4FC3F7' }}>.</span>
            </span>
          </div>
          <div className="reveal">
            <p className="font-inter text-sm text-white/35 max-w-xs leading-relaxed">
              All assets are print-ready and approved for media use. No watermarks.
            </p>
          </div>
        </div>

        <div className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRESS_ITEMS.map(({ icon: Icon, label, sub, href }) => (
            <a key={label} href={href}
              className="group flex flex-col gap-5 p-7 rounded-2xl border border-white/[0.07] hover:border-[#4FC3F7]/40 transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(10px)' }}>
              <span className="w-12 h-12 rounded-xl border border-white/[0.08] flex items-center justify-center group-hover:border-[#4FC3F7]/40 group-hover:text-[#4FC3F7] text-white/40 transition-all duration-300">
                <Icon size={20} />
              </span>
              <div>
                <p className="font-clash font-semibold text-base text-white group-hover:text-[#4FC3F7] transition-colors mb-1">{label}</p>
                <p className="font-inter text-[12px] text-white/30">{sub}</p>
              </div>
              <div className="mt-auto flex items-center gap-2 font-inter text-[12px] text-white/30 group-hover:text-[#4FC3F7] transition-colors">
                <Download size={12} /> Download
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
