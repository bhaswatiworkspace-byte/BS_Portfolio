import { useRef, useEffect } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';

const GALLERY = [
  'https://images.pexels.com/photos/2467285/pexels-photo-2467285.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=900',
];

const CAPABILITIES = [
  { num: '01', title: 'Creative Development', icon: '⬡', desc: 'WebGL shaders, Three.js, particle systems, and custom canvas experiences that redefine what the web can be.' },
  { num: '02', title: 'UI / UX Design', icon: '◈', desc: 'User-centric interfaces designed in Figma — from wireframes to living design systems and interactive prototypes.' },
  { num: '03', title: 'Motion & Animation', icon: '◎', desc: 'Scroll-driven storytelling, micro-interactions, and cinematic transitions that breathe life into every product.' },
  { num: '04', title: 'Frontend Engineering', icon: '⬕', desc: 'Production-grade React apps built for performance, accessibility, and long-term maintainability.' },
];

const TECHNOLOGIES = ['React', 'TypeScript', 'Three.js', 'WebGL', 'GSAP', 'Figma', 'Next.js', 'Node.js', 'D3.js', 'Framer Motion', 'Tailwind CSS', 'Supabase'];

// Parallax scale image component
function ScaleImage({ src, alt = '' }: { src: string; alt?: string }) {
  const { ref, progress } = useScrollProgress();
  const scale = 0.88 + progress * 0.26;

  return (
    <div ref={ref} className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: '4/5' }}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-none"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
  );
}

// Tilt card on hover
function CapabilityCard({ cap }: { cap: typeof CAPABILITIES[0] }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(8px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
  };

  return (
    <div
      ref={ref}
      className="relative p-7 rounded-2xl border border-white/[0.08] transition-[border-color,box-shadow] duration-300 hover:border-white/20 cursor-default tilt-card"
      style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', transition: 'transform 0.2s ease, border-color 0.3s' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="text-3xl mb-5 text-accent">{cap.icon}</div>
      <p className="font-inter text-label-sm text-white/25 mb-2">{cap.num}</p>
      <h3 className="font-clash font-semibold text-xl text-white mb-3">{cap.title}</h3>
      <p className="font-inter text-label-sm text-white/45 leading-relaxed">{cap.desc}</p>
    </div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.reveal, .reveal-left, .line-clip').forEach((item, i) => {
          setTimeout(() => item.classList.add('is-visible'), i * 110);
        });
        obs.disconnect();
      }
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative z-20 border-t border-white/[0.06]">

      {/* ─── Block 1: WHAT I AM ─── */}
      <div className="py-24 md:py-36 px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal mb-12">
            <span className="font-inter text-label-sm text-accent tracking-[0.25em] uppercase">01 — What I Am</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-start">
            {/* Scroll-scale photo */}
            <div className="reveal-left">
              <ScaleImage
                src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1000"
                alt="Bhaswati Sengupta"
              />
            </div>

            {/* Text content */}
            <div className="flex flex-col justify-center gap-8 lg:pt-12">
              <div className="line-clip">
                <span className="font-clash font-bold text-section text-white block">Hello<span className="text-accent">.</span></span>
              </div>
              <div className="line-clip" style={{ transitionDelay: '0.1s' }}>
                <span className="font-clash font-bold text-section text-white/20 block">I'm Bhaswati.</span>
              </div>

              <div className="reveal delay-200 space-y-5">
                <p className="font-inter text-xl-body text-white/50">
                  A creative developer and designer who lives at the intersection of art and engineering. I believe the web is the most powerful canvas of our time — and I treat it that way.
                </p>
                <p className="font-inter text-xl-body text-white/40">
                  I've spent 5+ years building digital products that don't just work — they feel. From award-winning interactive brand experiences to precise, accessible interfaces, every pixel is intentional.
                </p>
              </div>

              <div className="reveal delay-300 grid grid-cols-2 gap-px rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                {[['5+', 'Years'], ['40+', 'Projects'], ['20+', 'Clients'], ['8', 'Awards']].map(([v, l]) => (
                  <div key={l} className="p-6 hover:bg-white/[0.04] transition-colors duration-300" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)' }}>
                    <p className="font-clash font-bold text-3xl text-white mb-1">{v}</p>
                    <p className="font-inter text-label-sm text-white/30">{l}</p>
                  </div>
                ))}
              </div>

              <div className="reveal delay-400 flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="font-inter text-label-sm text-white/40">Available for new projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Block 2: WHAT I DO ─── */}
      <div className="py-24 md:py-32 px-8 md:px-12 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal mb-6">
            <span className="font-inter text-label-sm text-accent tracking-[0.25em] uppercase">02 — What I Do</span>
          </div>
          <div className="line-clip mb-14">
            <span className="font-clash font-bold text-section text-white block">Capabilities<span className="text-accent">.</span></span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CAPABILITIES.map((cap, i) => (
              <div key={cap.num} className={`reveal delay-${i * 100}`}>
                <CapabilityCard cap={cap} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Block 3: Photo gallery (scroll-scale) ─── */}
      <div className="py-20 md:py-28 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 mb-14">
          <div className="reveal">
            <span className="font-inter text-label-sm text-accent tracking-[0.25em] uppercase">03 — Process</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8 md:px-12 max-w-[1400px] mx-auto">
          {GALLERY.map((src, i) => (
            <div key={i} className={`reveal delay-${i * 100}`}>
              <ScaleImage src={src} />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Block 4: Technologies ─── */}
      <div className="py-24 md:py-32 px-8 md:px-12 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal mb-6">
            <span className="font-inter text-label-sm text-accent tracking-[0.25em] uppercase">04 — Stack</span>
          </div>
          <div className="line-clip mb-12">
            <span className="font-clash font-bold text-section text-white block">Technologies<span className="text-accent">.</span></span>
          </div>
          <div className="reveal flex flex-wrap gap-3">
            {TECHNOLOGIES.map(t => (
              <span key={t}
                className="font-inter text-base text-white/45 border border-white/[0.1] px-5 py-3 rounded-full hover:border-white/40 hover:text-white transition-all duration-300 cursor-default"
                style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.03)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Block 5: Video panel ─── */}
      <div className="relative border-t border-white/[0.06] overflow-hidden" style={{ height: '60vh', minHeight: '400px' }}>
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          src="https://videos.pexels.com/video-files/3129957/3129957-sd_640_360_30fps.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8">
          <div className="reveal mb-4">
            <span className="font-inter text-label-sm text-accent tracking-[0.25em] uppercase">Reel</span>
          </div>
          <div className="line-clip">
            <span className="font-clash font-bold text-[clamp(36px,4vw,60px)] text-white block" style={{ letterSpacing: '-0.03em' }}>
              Crafting the future of the web.
            </span>
          </div>
        </div>
      </div>

    </section>
  );
}
