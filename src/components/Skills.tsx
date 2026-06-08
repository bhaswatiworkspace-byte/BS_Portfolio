import { useRef, useEffect } from 'react';

const MARQUEE = [
  'React', 'TypeScript', 'Three.js', 'WebGL', 'GSAP', 'Figma',
  'Motion Design', 'Node.js', 'Tailwind', 'Next.js', 'D3.js', 'Framer',
  'React', 'TypeScript', 'Three.js', 'WebGL', 'GSAP', 'Figma',
  'Motion Design', 'Node.js', 'Tailwind', 'Next.js', 'D3.js', 'Framer',
];

const CAPS = [
  { num: '01', title: 'Creative Development', desc: 'Interactive experiences, WebGL shaders, particle systems, and custom canvas animations.' },
  { num: '02', title: 'UI & UX Design', desc: 'Interface design rooted in clarity. Wireframes, prototypes, and polished design systems.' },
  { num: '03', title: 'Motion & Animation', desc: 'Scroll-driven animations, micro-interactions, and cinematic page transitions.' },
  { num: '04', title: 'Frontend Engineering', desc: 'Production-grade React with a focus on performance and maintainability.' },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.reveal, .line-clip').forEach((item, i) => {
          setTimeout(() => item.classList.add('is-visible'), i * 100);
        });
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="relative z-20 py-24 md:py-36 border-t border-white/[0.06] overflow-hidden">
      {/* Marquee strip */}
      <div className="mb-24 overflow-hidden py-5 border-y border-white/[0.06] backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="marquee-track">
          {MARQUEE.map((item, i) => (
            <span key={i} className="flex items-center gap-6 px-4">
              <span className="font-clash font-medium text-2xl md:text-3xl text-white/30 whitespace-nowrap hover:text-white transition-colors duration-300 cursor-default">{item}</span>
              <span className="text-accent text-xl">—</span>
            </span>
          ))}
        </div>
      </div>

      <div className="px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal mb-5">
            <span className="font-inter text-label-sm text-accent tracking-[0.25em] uppercase">03 — Capabilities</span>
          </div>
          <div className="line-clip mb-16">
            <span className="font-clash font-bold text-section text-white block">What I Do<span className="text-accent">.</span></span>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {CAPS.map((cap, i) => (
              <div
                key={cap.num}
                className={`reveal delay-${i * 100} group flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-16 py-8 md:py-10 hover:pl-2 transition-all duration-300`}
              >
                <div className="flex items-start gap-10 flex-1">
                  <span className="font-inter text-label-sm text-white/20 mt-0.5 flex-shrink-0 w-6">{cap.num}</span>
                  <h3 className="font-clash font-semibold text-xl md:text-2xl text-white group-hover:text-accent transition-colors duration-300">{cap.title}</h3>
                </div>
                <p className="font-inter text-label-sm text-white/35 leading-relaxed max-w-sm pl-16 md:pl-0">{cap.desc}</p>
              </div>
            ))}
          </div>

          <div className="reveal mt-20">
            <p className="font-inter text-label-sm text-white/20 tracking-widest uppercase mb-8">Full Stack</p>
            <div className="flex flex-wrap gap-3">
              {['React', 'TypeScript', 'Next.js', 'Three.js', 'WebGL', 'GSAP', 'Tailwind CSS', 'Node.js', 'Figma', 'D3.js', 'Framer Motion', 'Supabase'].map(t => (
                <span key={t}
                  className="font-inter text-base text-white/40 border border-white/[0.08] px-5 py-2.5 rounded-full hover:border-accent hover:text-white transition-all duration-300 cursor-default"
                  style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.02)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
