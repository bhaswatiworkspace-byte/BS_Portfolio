import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowDownRight, Download, Calendar } from 'lucide-react';

const VIDEOS = [
  '/Portfolio1.mp4',
  '/Portfolio2.mp4',
  '/Portfolio3.mp4',
  '/Portfolio4.mp4',
];

interface HeroProps {
  loaded: boolean;
}

export default function Hero({ loaded }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const [current, setCurrent]             = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const touchStartX                       = useRef<number | null>(null);
  const mouseStartX                       = useRef<number | null>(null);

  useEffect(() => {
    if (!loaded) return;
    const el = sectionRef.current;
    if (el) el.style.opacity = '1';
  }, [loaded]);

  const goTo = useCallback((index: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setTransitioning(false);
    }, 400);
  }, [transitioning]);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % VIDEOS.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    v.play().catch(() => {});
  }, [current]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50)
      goTo(diff > 0
        ? (current + 1) % VIDEOS.length
        : (current - 1 + VIDEOS.length) % VIDEOS.length);
    touchStartX.current = null;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX.current === null) return;
    const diff = mouseStartX.current - e.clientX;
    if (Math.abs(diff) > 50)
      goTo(diff > 0
        ? (current + 1) % VIDEOS.length
        : (current - 1 + VIDEOS.length) % VIDEOS.length);
    mouseStartX.current = null;
  };

  return (
    <div className="flex items-center justify-center" style={{ height: '110vh' }}>
      <section
        ref={sectionRef}
        id="home"
        className="relative overflow-hidden mx-auto select-none"
        style={{
          height: '85vh',
          opacity: 0,
          aspectRatio: '16/9',
          width: '85%',
          cursor: 'grab',
          transition: 'opacity 1.2s cubic-bezier(0.16,1,0.3,1)',
          maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 55%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 55%, transparent 100%)',
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        {/* Video */}
        <video
          ref={videoRef}
          key={current}
          autoPlay
          loop={false}
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            zIndex: 1,
            opacity: transitioning ? 0 : 1,
            transition: 'opacity 0.4s ease',
          }}
        >
          <source src={VIDEOS[current]} type="video/mp4" />
        </video>

        {/* Radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.60) 100%)',
          }}
        />

        {/* Bottom fade into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            zIndex: 2,
            background: 'linear-gradient(to bottom, transparent, #000)',
          }}
        />

        {/* Number navigation dots */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3"
          style={{ zIndex: 4 }}
        >
          {VIDEOS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width:          i === current ? '36px' : '28px',
                height:         '28px',
                borderRadius:   '6px',
                border:         i === current
                  ? '1.5px solid rgba(255,255,255,0.9)'
                  : '1.5px solid rgba(255,255,255,0.35)',
                background:     i === current
                  ? 'rgba(255,255,255,0.18)'
                  : 'rgba(0,0,0,0.30)',
                color:          i === current ? '#fff' : 'rgba(255,255,255,0.45)',
                fontSize:       '11px',
                fontFamily:     'Inter, sans-serif',
                fontWeight:     i === current ? 600 : 400,
                letterSpacing:  '0.05em',
                cursor:         'pointer',
                transition:     'all 0.3s ease',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ zIndex: 3, height: '2px', background: 'rgba(255,255,255,0.08)' }}
        >
          <div
            style={{
              height:     '100%',
              background: 'rgba(255,255,255,0.55)',
              width:      `${((current + 1) / VIDEOS.length) * 100}%`,
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        {/* Content — bottom-left overlay */}
        <div
          className="absolute inset-x-0 bottom-0 px-8 md:px-16 pb-16 md:pb-20"
          style={{ zIndex: 3 }}
        >
          {/* Genre / tagline */}
          <div className="mb-5" style={{ overflow: 'hidden' }}>
            <span
              className="inline-block font-inter text-[11px] text-white/55 tracking-[0.35em] uppercase border border-white/20 px-4 py-2 rounded-full backdrop-blur-sm"
              style={{
                background: 'rgba(0,0,0,0.35)',
                opacity: loaded ? 1 : 0,
                transform: loaded ? 'translateY(0)' : 'translateY(100%)',
                transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              Rock × EDM Live Experience
            </span>
          </div>

          {/* Artist name */}
          <div className="mb-2" style={{ overflow: 'hidden' }}>
            <span
              className="font-clash font-bold text-white block"
              style={{
                fontSize: 'clamp(52px,8.5vw,130px)',
                lineHeight: '0.90',
                letterSpacing: '-0.04em',
                opacity: loaded ? 1 : 0,
                transform: loaded ? 'translateY(0)' : 'translateY(100%)',
                transition: 'opacity 0.7s ease 0.08s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.08s',
              }}
            >
              Bhaswati
            </span>
          </div>
          <div className="mb-8" style={{ overflow: 'hidden' }}>
            <span
              className="font-clash font-bold text-white block"
              style={{
                fontSize: 'clamp(52px,8.5vw,130px)',
                lineHeight: '0.90',
                letterSpacing: '-0.04em',
                opacity: loaded ? 1 : 0,
                transform: loaded ? 'translateY(0)' : 'translateY(100%)',
                transition: 'opacity 0.7s ease 0.18s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.18s',
              }}
            >
              Sengupta<span style={{ color: '#4FC3F7' }}>.</span>
            </span>
          </div>

          {/* Sub-tagline */}
          <div className="mb-10" style={{ overflow: 'hidden' }}>
            <span
              className="font-inter text-white/50 text-base md:text-lg block"
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? 'translateY(0)' : 'translateY(100%)',
                transition: 'opacity 0.7s ease 0.28s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.28s',
              }}
            >
              Corporate Events&nbsp;&nbsp;·&nbsp;&nbsp;Weddings&nbsp;&nbsp;·&nbsp;&nbsp;Clubs&nbsp;&nbsp;·&nbsp;&nbsp;Festivals
            </span>
          </div>

          {/* CTAs */}
          <div
            className="flex flex-wrap items-center gap-4"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.7s ease 0.4s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s',
            }}
          >
            <a
              href="#showreel"
              className="group inline-flex items-center gap-3 font-clash font-semibold text-sm bg-white text-black px-7 py-4 rounded-full hover:bg-[#4FC3F7] transition-all duration-300 hover:shadow-[0_0_28px_rgba(79,195,247,0.45)]"
            >
              Watch Showreel
              <ArrowDownRight size={15} className="transition-transform duration-300 group-hover:rotate-45" />
            </a>
            <a
              href="#press"
              className="group inline-flex items-center gap-3 font-inter text-sm text-white/70 hover:text-white border border-white/20 hover:border-white/50 px-7 py-4 rounded-full transition-all duration-300"
              style={{ backdropFilter: 'blur(10px)', background: 'rgba(0,0,0,0.35)' }}
            >
              <Download size={14} />
              Download Press Kit
            </a>
            <a
              href="#booking"
              className="group inline-flex items-center gap-3 font-inter text-sm text-white/70 hover:text-white border border-[#4FC3F7]/40 hover:border-[#4FC3F7] px-7 py-4 rounded-full transition-all duration-300"
              style={{ backdropFilter: 'blur(10px)', background: 'rgba(79,195,247,0.08)' }}
            >
              <Calendar size={14} />
              Book Now
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-10 right-10 flex flex-col items-center gap-2"
          style={{ zIndex: 3 }}
        >
          <span
            className="font-inter text-[10px] text-white/35 tracking-[0.3em] uppercase"
            style={{ writingMode: 'vertical-rl' }}
          >
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
        </div>
      </section>
    </div>
  );
}
