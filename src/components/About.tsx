import { useRef, useEffect, useState } from 'react';

const SHORT_BIO =
  'Bhaswati Sengupta is a high-energy Rock × EDM live act delivering immersive performances for corporate events, weddings, clubs, and festivals. Combining live musicianship with electronic production, the act creates unforgettable audience experiences designed to keep crowds engaged from start to finish.';

const FULL_BIO = [
  "With over a decade of stage presence across India's most celebrated venues and festivals, Bhaswati Sengupta has carved a niche at the electrifying crossroads of rock authenticity and EDM energy. Her live sets are a seamless fusion of searing guitar riffs, soaring vocals, and pulsating electronic beats — a sonic experience that has repeatedly stopped audiences in their tracks.",
  "Born into music in Kolkata, Bhaswati began classical training at age seven before discovering her calling in the electric collision of contemporary rock and dance music. By her early twenties she was headlining club nights in Mumbai and Bengaluru, earning a reputation as one of the most versatile and bankable live acts in the country.",
  "Her collaborations span across India's premier recording landscape, having worked alongside industry professionals connected to Sachin–Jigar and Amjad Nadeem. Her original releases have accumulated millions of streams, and her live recordings regularly surface on curated playlists across Spotify and Apple Music.",
  "From intimate 50-person corporate dinners to 5,000-seat festival stages, Bhaswati adapts her performance format — solo, duo, trio, or full 4-piece live band — to fit any brief while maintaining the same uncompromising energy. She brings a full production rider, LED visual capabilities, and a professional crew that ensures every detail is flawless.",
];

const STATS = [
  { value: '10+',  label: 'Years Performing' },
  { value: '500+', label: 'Live Shows' },
  { value: '40+',  label: 'Cities' },
  { value: '2M+',  label: 'Streams' },
];

const COLLABS = [
  { name: 'Sachin–Jigar', desc: 'Collaborated with industry professionals connected to the acclaimed Bollywood composer duo.' },
  { name: 'Amjad Nadeem', desc: 'Studio sessions and live performances alongside collaborators of the celebrated composer.' },
  { name: 'Independent Releases', desc: 'Original compositions on Spotify, Apple Music, and YouTube with 2M+ combined streams.' },
  { name: 'Festival Circuit', desc: "Performed at 40+ cities across India's premier corporate and festival circuits." },
];

export default function About() {
  const sectionRef  = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.reveal, .reveal-left, .line-clip').forEach((item, i) => {
          setTimeout(() => item.classList.add('is-visible'), i * 90);
        });
        obs.disconnect();
      }
    }, { threshold: 0.04 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative z-20 border-t border-white/[0.06]">

      {/* ── Artist Bio ── */}
      <div className="py-24 md:py-36 px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal mb-10">
            <span className="font-inter text-[11px] text-[#4FC3F7] tracking-[0.3em] uppercase">01 — Artist Bio</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-16 lg:gap-28 items-start">
            {/* Photo */}
            <div className="reveal-left">
              <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '3/4' }}>
                <img
                  src="https://images.pexels.com/photos/1649693/pexels-photo-1649693.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="Bhaswati Sengupta performing live"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-clash font-bold text-2xl text-white">Bhaswati Sengupta</p>
                  <p className="font-inter text-sm text-white/50 mt-1">Rock × EDM Live Act</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-8 lg:pt-4">
              <div className="line-clip">
                <span className="font-inter text-[11px] text-white/30 tracking-[0.25em] uppercase block">Short Bio — for press use</span>
              </div>

              <blockquote
                className="reveal font-clash font-medium text-xl md:text-2xl text-white/80 leading-relaxed border-l-2 pl-7"
                style={{ borderColor: '#4FC3F7', letterSpacing: '-0.01em' }}
              >
                "{SHORT_BIO}"
              </blockquote>

              <div className="reveal delay-100">
                <button
                  onClick={() => setExpanded(v => !v)}
                  className="font-inter text-sm text-[#4FC3F7]/70 hover:text-[#4FC3F7] border border-[#4FC3F7]/25 hover:border-[#4FC3F7]/60 px-5 py-2.5 rounded-full transition-all duration-300 mb-6"
                >
                  {expanded ? 'Show Less ↑' : 'Read Full Bio ↓'}
                </button>

                <div
                  className="overflow-hidden transition-all duration-700"
                  style={{ maxHeight: expanded ? '900px' : '0px', opacity: expanded ? 1 : 0 }}
                >
                  <div className="space-y-5 pb-2">
                    {FULL_BIO.map((p, i) => (
                      <p key={i} className="font-inter text-base text-white/45 leading-relaxed">{p}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="reveal delay-200 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                {STATS.map(({ value, label }) => (
                  <div key={label} className="p-6 hover:bg-white/[0.04] transition-colors duration-300 text-center" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)' }}>
                    <p className="font-clash font-bold text-3xl text-white mb-1">{value}</p>
                    <p className="font-inter text-[11px] text-white/35 leading-tight">{label}</p>
                  </div>
                ))}
              </div>

              <div className="reveal delay-300 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#4FC3F7] animate-pulse" />
                <span className="font-inter text-sm text-white/40">Available for bookings — respond within 24h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Notable Collaborations ── */}
      <div className="py-16 px-8 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal mb-8">
            <span className="font-inter text-[11px] text-[#4FC3F7] tracking-[0.3em] uppercase">02 — Notable Collaborations</span>
          </div>
          <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-5">
            {COLLABS.map(({ name, desc }) => (
              <div key={name}
                className="p-6 rounded-2xl border border-white/[0.07] hover:border-[#4FC3F7]/30 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(10px)' }}>
                <p className="font-clash font-semibold text-lg text-white mb-2">{name}</p>
                <p className="font-inter text-sm text-white/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
