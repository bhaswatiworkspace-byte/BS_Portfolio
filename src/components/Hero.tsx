import { useEffect, useRef } from 'react';
import { ArrowDownRight, Download, Calendar } from 'lucide-react';

const HERO_VIDEO =
  'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4';
const HERO_FALLBACK =
  'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1920';

interface HeroProps {
  loaded: boolean;
}

export default function Hero({ loaded }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!loaded) return;
    const el = sectionRef.current;
    if (!el) return;
    el.style.opacity = '1';
    const timer = setTimeout(() => {
      el.querySelectorAll('.line-clip').forEach((item, i) => {
        setTimeout(() => item.classList.add('is-visible'), i * 120);
      });
      el.querySelectorAll('.reveal').forEach((item, i) => {
        setTimeout(() => item.classList.add('is-visible'), i * 100 + 500);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [loaded]);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', opacity: 0, transition: 'opacity 1.2s cubic-bezier(0.16,1,0.3,1)' }}
    >
      {/* Fallback still */}
      <img
        src={HERO_FALLBACK}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />

      {/* Full-bleed looping performance video */}
      <video
        ref={videoRef}
        autoPlay loop muted playsInline
        poster={HERO_FALLBACK}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 1 }}
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      {/* Dark cinematic overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.20) 40%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* Content — bottom-left, festival-poster style */}
      <div
        className="absolute inset-x-0 bottom-0 px-8 md:px-16 pb-16 md:pb-20"
        style={{ zIndex: 3 }}
      >
        {/* Genre / tagline */}
        <div className="line-clip mb-5">
          <span className="inline-block font-inter text-[11px] text-white/55 tracking-[0.35em] uppercase border border-white/20 px-4 py-2 rounded-full backdrop-blur-sm"
            style={{ background: 'rgba(0,0,0,0.35)' }}>
            Rock × EDM Live Experience
          </span>
        </div>

        {/* Artist name */}
        <div className="line-clip mb-2" style={{ transitionDelay: '0.08s' }}>
          <span className="font-clash font-bold text-white block"
            style={{ fontSize: 'clamp(52px,8.5vw,130px)', lineHeight: '0.90', letterSpacing: '-0.04em' }}>
            Bhaswati
          </span>
        </div>
        <div className="line-clip mb-8" style={{ transitionDelay: '0.18s' }}>
          <span className="font-clash font-bold text-white block"
            style={{ fontSize: 'clamp(52px,8.5vw,130px)', lineHeight: '0.90', letterSpacing: '-0.04em' }}>
            Sengupta<span style={{ color: '#4FC3F7' }}>.</span>
          </span>
        </div>

        {/* Sub-tagline */}
        <div className="line-clip mb-10" style={{ transitionDelay: '0.28s' }}>
          <span className="font-inter text-white/50 text-base md:text-lg block">
            Corporate Events&nbsp;&nbsp;·&nbsp;&nbsp;Weddings&nbsp;&nbsp;·&nbsp;&nbsp;Clubs&nbsp;&nbsp;·&nbsp;&nbsp;Festivals
          </span>
        </div>

        {/* CTAs */}
        <div className="reveal flex flex-wrap items-center gap-4">
          <a href="#showreel"
            className="group inline-flex items-center gap-3 font-clash font-semibold text-sm bg-white text-black px-7 py-4 rounded-full hover:bg-[#4FC3F7] transition-all duration-300 hover:shadow-[0_0_28px_rgba(79,195,247,0.45)]">
            Watch Showreel
            <ArrowDownRight size={15} className="transition-transform duration-300 group-hover:rotate-45" />
          </a>
          <a href="#press"
            className="group inline-flex items-center gap-3 font-inter text-sm text-white/70 hover:text-white border border-white/20 hover:border-white/50 px-7 py-4 rounded-full transition-all duration-300"
            style={{ backdropFilter: 'blur(10px)', background: 'rgba(0,0,0,0.35)' }}>
            <Download size={14} />
            Download Press Kit
          </a>
          <a href="#booking"
            className="group inline-flex items-center gap-3 font-inter text-sm text-white/70 hover:text-white border border-[#4FC3F7]/40 hover:border-[#4FC3F7] px-7 py-4 rounded-full transition-all duration-300"
            style={{ backdropFilter: 'blur(10px)', background: 'rgba(79,195,247,0.08)' }}>
            <Calendar size={14} />
            Book Now
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-10 right-10 flex flex-col items-center gap-2 reveal"
        style={{ zIndex: 3 }}
      >
        <span className="font-inter text-[10px] text-white/35 tracking-[0.3em] uppercase" style={{ writingMode: 'vertical-rl' }}>
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
