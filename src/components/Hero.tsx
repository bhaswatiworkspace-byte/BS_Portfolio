import { useEffect, useRef } from 'react';

// Cinematic looping sample video (freely licensed, Pexels)
const HERO_VIDEO =
  'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4';

// Still fallback while video loads
const HERO_FALLBACK =
  'https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&w=1920';

interface HeroProps {
  loaded: boolean;
}

export default function Hero({ loaded }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);

  // Fade the section in after the loader clears
  useEffect(() => {
    if (!loaded) return;
    const el = sectionRef.current;
    if (el) el.style.opacity = '1';
  }, [loaded]);

  // Force-play on mobile (autoplay sometimes needs a nudge)
  useEffect(() => {
    videoRef.current?.play().catch(() => {/* silent */});
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full overflow-hidden"
      style={{
        height: '100vh',
        opacity: 0,
        transition: 'opacity 1.2s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Fallback still (shown while video is loading) */}
      <img
        src={HERO_FALLBACK}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />

      {/* Full-bleed looping video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster={HERO_FALLBACK}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 1 }}
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      {/* Radial vignette — keeps piano canvas readable at edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.60) 100%)',
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

      {/* Scroll cue */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          zIndex: 3,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1s ease 1.5s',
        }}
      >
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/40 animate-pulse" />
        <span className="font-inter text-[10px] text-white/40 tracking-[0.3em] uppercase">
          Scroll
        </span>
      </div>
    </section>
  );
}
