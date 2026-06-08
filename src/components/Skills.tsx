import { useRef, useEffect } from 'react';
import { Download, Music, Headphones } from 'lucide-react';

const GALLERY_SECTIONS = [
  {
    label: 'Live Performance',
    images: [
      'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
  },
  {
    label: 'Stage Presence',
    images: [
      'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
  },
  {
    label: 'Crowd Interaction',
    images: [
      'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
  },
  {
    label: 'Promotional',
    images: [
      'https://images.pexels.com/photos/1649693/pexels-photo-1649693.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
  },
];

const RIDER = [
  { category: 'Audio Requirements', items: ['Professional PA system (min. 3 kW)', 'Subwoofers for full-range bass response', 'Digital mixing console (Yamaha QL / Allen & Heath)', '4× monitor wedges on stage'] },
  { category: 'Stage Requirements', items: ['Minimum 8ft × 8ft clear performance area', 'Power outlets: 4× 15A sockets on stage', 'Stage lighting: minimum 6 frontlights', 'LED backdrop / screen (if available)'] },
  { category: 'Monitoring Requirements', items: ['In-ear monitor mix (stereo)', 'Drum monitor wedge (for solo acts: click track)', 'Full stereo mix return to stage'] },
  { category: 'Performance Duration', items: ['60 min set — recommended for corporate', '90 min set — weddings and clubs', 'Festival: 45 min headline set', 'Sound check: 45 min prior to show'] },
];

const MUSIC_LINKS = [
  { icon: Music, label: 'Spotify', sub: 'Follow & stream', href: '#', color: '#1DB954' },
  { icon: Headphones, label: 'Apple Music', sub: 'Listen on Apple', href: '#', color: '#FC3C44' },
  { icon: Download, label: 'YouTube', sub: 'Watch live sets', href: '#', color: '#FF0000' },
];

const TESTIMONIALS = [
  { quote: 'An electrifying performance that kept the audience engaged throughout the evening. Truly world-class.', from: 'Corporate Event Director, HDFC Bank Annual Gala 2024' },
  { quote: 'Our wedding reception was absolutely transformed. The energy was phenomenal — guests are still talking about it.', from: 'Wedding Client, Taj Hotel Mumbai' },
  { quote: 'Professional, energetic, and incredibly easy to work with. Bhaswati is our first call for any premium event.', from: 'Head of Events, SummitFest 2023' },
];

export default function Skills() {
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
    }, { threshold: 0.04 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="relative z-20 border-t border-white/[0.06] overflow-hidden">

      {/* ── Photo Gallery ── */}
      <div className="py-24 md:py-32 px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal mb-6">
            <span className="font-inter text-[11px] text-[#4FC3F7] tracking-[0.3em] uppercase">05 — Photo Gallery</span>
          </div>
          <div className="line-clip mb-14">
            <span className="font-clash font-bold text-section text-white block">
              The Visuals<span style={{ color: '#4FC3F7' }}>.</span>
            </span>
          </div>

          {GALLERY_SECTIONS.map(({ label, images }, si) => (
            <div key={label} className={`reveal mb-10`} style={{ transitionDelay: `${si * 60}ms` }}>
              <p className="font-inter text-[11px] text-white/30 tracking-[0.25em] uppercase mb-4">{label}</p>
              <div className="grid grid-cols-2 gap-3">
                {images.map((src, i) => (
                  <div key={i} className="group relative rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img
                      src={src}
                      alt={`${label} ${i + 1}`}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Music ── */}
      <div className="py-16 px-8 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal mb-6">
            <span className="font-inter text-[11px] text-[#4FC3F7] tracking-[0.3em] uppercase">06 — Music</span>
          </div>
          <div className="line-clip mb-10">
            <span className="font-clash font-bold text-section text-white block">Stream &amp; Listen<span style={{ color: '#4FC3F7' }}>.</span></span>
          </div>
          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {MUSIC_LINKS.map(({ icon: Icon, label, sub, href, color }) => (
              <a key={label} href={href}
                className="group flex items-center gap-5 p-6 rounded-2xl border border-white/[0.07] hover:border-white/20 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(10px)' }}>
                <span className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}22` }}>
                  <Icon size={22} style={{ color }} />
                </span>
                <div>
                  <p className="font-clash font-semibold text-base text-white group-hover:text-[#4FC3F7] transition-colors">{label}</p>
                  <p className="font-inter text-[12px] text-white/35">{sub}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div className="py-16 px-8 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal mb-6">
            <span className="font-inter text-[11px] text-[#4FC3F7] tracking-[0.3em] uppercase">07 — Testimonials</span>
          </div>
          <div className="line-clip mb-12">
            <span className="font-clash font-bold text-section text-white block">What They Say<span style={{ color: '#4FC3F7' }}>.</span></span>
          </div>
          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ quote, from }, i) => (
              <div key={i}
                className="p-8 rounded-2xl border border-white/[0.07] hover:border-[#4FC3F7]/25 transition-all duration-300 flex flex-col justify-between gap-8"
                style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(10px)' }}>
                <p className="font-clash font-medium text-lg text-white/75 leading-relaxed">
                  <span className="text-[#4FC3F7] text-4xl leading-none mr-1 font-serif">"</span>
                  {quote}
                  <span className="text-[#4FC3F7] text-4xl leading-none ml-1 font-serif">"</span>
                </p>
                <p className="font-inter text-[11px] text-white/30 leading-relaxed border-t border-white/[0.06] pt-4">— {from}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Technical Rider ── */}
      <div className="py-16 px-8 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal mb-6">
            <span className="font-inter text-[11px] text-[#4FC3F7] tracking-[0.3em] uppercase">08 — Technical Rider</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="line-clip">
              <span className="font-clash font-bold text-section text-white block">Tech Rider<span style={{ color: '#4FC3F7' }}>.</span></span>
            </div>
            <div className="reveal">
              <a href="#press"
                className="inline-flex items-center gap-3 font-inter text-sm text-white/60 hover:text-white border border-white/20 hover:border-white/50 px-6 py-3 rounded-full transition-all duration-300"
                style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.04)' }}>
                <Download size={14} />
                Download PDF Rider
              </a>
            </div>
          </div>

          <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-6">
            {RIDER.map(({ category, items }) => (
              <div key={category}
                className="p-7 rounded-2xl border border-white/[0.07]"
                style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)' }}>
                <p className="font-inter text-[11px] text-[#4FC3F7] tracking-[0.25em] uppercase mb-5">{category}</p>
                <ul className="space-y-3">
                  {items.map(item => (
                    <li key={item} className="flex items-start gap-3 font-inter text-sm text-white/50">
                      <span className="w-1 h-1 rounded-full bg-[#4FC3F7]/50 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
