import { useState, useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Bio',      href: '#about'    },
  { label: 'Showreel', href: '#showreel' },
  { label: 'Gallery',  href: '#skills'   },
  { label: 'Press',    href: '#press'    },
];

function AnimatedLogo() {
  const label = 'B.S.';
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(() => setVisible(true), 250);
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <a href="#home" className="group relative font-clash font-bold text-base tracking-tight text-white">
      <span className="inline-flex" aria-hidden="true">
        {label.split('').map((ch, i) => (
          <span
            key={i}
            className="inline-block"
            style={{
              opacity:   visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(14px)',
              transition: `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 55}ms,
                           transform 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 55}ms`,
            }}
          >
            {ch === '.' ? (
              <span style={{
                display: 'inline-block',
                color: '#4FC3F7',
                animation: visible ? `nav-dot 2.5s ease-in-out ${i * 350}ms infinite` : 'none',
              }}>.</span>
            ) : ch}
          </span>
        ))}
      </span>
      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{ background: 'rgba(255,255,255,0.25)' }} />
      <style>{`
        @keyframes nav-dot {
          0%, 100% { opacity: 1;   transform: scaleY(1) translateY(0); }
          50%       { opacity: 0.3; transform: scaleY(0.5) translateY(2px); }
        }
      `}</style>
    </a>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3 backdrop-blur-xl border-b border-white/[0.06]' : 'py-6'
      }`}
      style={scrolled ? { background: 'rgba(0,0,0,0.90)' } : undefined}
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex items-center justify-between">
        <AnimatedLogo />

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href}
              className="group relative font-inter text-nav-size text-white/45 hover:text-white transition-colors duration-300">
              {l.label}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#4FC3F7]/70 scale-0 group-hover:scale-100 transition-transform duration-300" />
            </a>
          ))}
          <a href="#booking"
            className="inline-flex items-center gap-2 font-inter text-label-sm font-medium px-5 py-2.5 rounded-full border border-[#4FC3F7]/40 text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-black hover:border-[#4FC3F7] transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,195,247,0.35)]">
            <Calendar size={13} />
            Book Now
          </a>
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden p-1 flex flex-col gap-[5px]" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={`h-px w-6 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`h-px w-6 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`h-px w-6 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ background: 'rgba(0,0,0,0.97)' }}>
        <nav className="flex flex-col px-8 py-6 gap-5">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="font-clash font-semibold text-3xl text-white" onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
          <a href="#booking"
            className="font-inter text-sm font-medium px-5 py-3 rounded-full border border-[#4FC3F7]/40 text-[#4FC3F7] text-center mt-2"
            onClick={() => setMenuOpen(false)}>
            Book Now
          </a>
        </nav>
      </div>
    </header>
  );
}
