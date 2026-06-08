import { useRef, useEffect } from 'react';
import { Play } from 'lucide-react';

const SHOWREEL_VIDEO =
  'https://videos.pexels.com/video-files/3771823/3771823-uhd_2560_1440_25fps.mp4';
const SHOWREEL_POSTER =
  'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1920';

const FORMATS = [
  { label: 'Solo Act', desc: 'Intimate acoustic + electronic set' },
  { label: 'Duo', desc: 'Vocal + keys or vocal + guitarist' },
  { label: 'Trio', desc: 'Full rhythm section + lead' },
  { label: '4-Piece Live Band', desc: 'Complete production experience' },
];

const EVENT_TYPES = [
  'Corporate Events', 'Weddings', 'Private Events', 'Clubs', 'Festivals', 'Award Nights',
];

const HIGHLIGHTS = [
  {
    src: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Live crowd engagement — Mumbai, 2024',
  },
  {
    src: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Festival main stage — Bengaluru',
  },
  {
    src: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Corporate gala — Hyderabad',
  },
  {
    src: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Club night set — Delhi',
  },
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.reveal, .line-clip').forEach((item, i) => {
          if (!item.classList.contains('group'))
            setTimeout(() => item.classList.add('is-visible'), i * 80);
        });
        obs.disconnect();
      }
    }, { threshold: 0.04 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="showreel" ref={sectionRef} className="relative z-20 border-t border-white/[0.06]">

      {/* ── Showreel ── */}
      <div className="py-24 md:py-36 px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal mb-6">
            <span className="font-inter text-[11px] text-[#4FC3F7] tracking-[0.3em] uppercase">03 — Showreel</span>
          </div>
          <div className="line-clip mb-12">
            <span className="font-clash font-bold text-section text-white block">
              Watch the Experience<span style={{ color: '#4FC3F7' }}>.</span>
            </span>
          </div>

          {/* Main video */}
          <div className="reveal relative rounded-3xl overflow-hidden border border-white/[0.08] group cursor-pointer"
            style={{ background: '#000' }}>
            <video
              autoPlay loop muted playsInline
              poster={SHOWREEL_POSTER}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              style={{ aspectRatio: '16/9', maxHeight: '75vh' }}
            >
              <source src={SHOWREEL_VIDEO} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />

            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30">
                <Play size={28} className="text-white ml-1" />
              </div>
            </div>

            <div className="absolute bottom-6 left-6">
              <span className="font-inter text-[11px] text-white/60 tracking-[0.25em] uppercase border border-white/20 px-4 py-2 rounded-full backdrop-blur-sm"
                style={{ background: 'rgba(0,0,0,0.45)' }}>
                60–90 sec performance cut
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Performance Highlights (gallery) ── */}
      <div id="work" className="py-16 px-8 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal mb-6">
            <span className="font-inter text-[11px] text-[#4FC3F7] tracking-[0.3em] uppercase">04 — Performance Highlights</span>
          </div>
          <div className="line-clip mb-12">
            <span className="font-clash font-bold text-section text-white block">
              Live Moments<span style={{ color: '#4FC3F7' }}>.</span>
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16">
            {HIGHLIGHTS.map(({ src, caption }, i) => (
              <div key={i} className={`reveal group relative rounded-xl overflow-hidden cursor-default`}
                style={{ transitionDelay: `${i * 80}ms`, aspectRatio: i === 0 ? '3/4' : '3/4' }}>
                <img src={src} alt={caption} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <p className="absolute bottom-3 left-3 right-3 font-inter text-[11px] text-white/70 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400 leading-tight">{caption}</p>
              </div>
            ))}
          </div>

          {/* Available Formats + Event Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Formats */}
            <div className="reveal p-8 rounded-2xl border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(12px)' }}>
              <p className="font-inter text-[11px] text-[#4FC3F7] tracking-[0.25em] uppercase mb-6">Available Formats</p>
              <div className="divide-y divide-white/[0.06]">
                {FORMATS.map(({ label, desc }) => (
                  <div key={label} className="group flex items-center justify-between py-4 hover:pl-1 transition-all duration-200">
                    <div>
                      <p className="font-clash font-semibold text-base text-white group-hover:text-[#4FC3F7] transition-colors duration-200">{label}</p>
                      <p className="font-inter text-[12px] text-white/35 mt-0.5">{desc}</p>
                    </div>
                    <span className="font-inter text-[11px] text-[#4FC3F7]/50 border border-[#4FC3F7]/20 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">Available</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Types */}
            <div className="reveal delay-100 p-8 rounded-2xl border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(12px)' }}>
              <p className="font-inter text-[11px] text-[#4FC3F7] tracking-[0.25em] uppercase mb-6">Event Types</p>
              <div className="flex flex-wrap gap-3">
                {EVENT_TYPES.map(t => (
                  <span key={t}
                    className="font-inter text-sm text-white/55 border border-white/[0.10] px-5 py-2.5 rounded-full hover:border-[#4FC3F7]/50 hover:text-white transition-all duration-300 cursor-default"
                    style={{ background: 'rgba(0,0,0,0.3)' }}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-8 p-5 rounded-xl border border-[#4FC3F7]/15" style={{ background: 'rgba(79,195,247,0.05)' }}>
                <p className="font-inter text-sm text-white/50 leading-relaxed">
                  All formats include professional sound equipment, stage monitoring, and technical rider. LED visual packages available on request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
