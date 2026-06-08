import { useState, useEffect, useRef } from 'react';
import { SITE_NAME } from '../lib/config';

const NAV_LINKS = [
  { label: 'About',   href: '#about'   },
  { label: 'Work',    href: '#work'    },
  { label: 'Skills',  href: '#skills'  },
  { label: 'Contact', href: '#contact' },
];

function buildInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('.');
}

// Each character of the logo slides up sequentially on mount;
// dots pulse continuously; a sweep-underline appears on hover.
function AnimatedLogo() {
  const label = buildInitials(SITE_NAME) + '.';
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(() => setVisible(true), 250);
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <a href="#" className="group relative font-clash font-bold text-base tracking-tight text-white">
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
              <span
                style={{
                  display: 'inline-block',
                  color: '#ffffff',
                  animation: visible
                    ? `nav-dot 2.5s ease-in-out ${i * 350}ms infinite`
                    : 'none',
                }}
              >
                .
              </span>
            ) : ch}
          </span>
        ))}
      </span>

      {/* Hover underline sweep */}
      <span
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{ background: 'rgba(255,255,255,0.30)' }}
      />

      <style>{`
        @keyframes nav-dot {
          0%, 100% { opacity: 1;   transform: scaleY(1) translateY(0);   }
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
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-4 backdrop-blur-xl border-b border-white/[0.06]' : 'py-7'
      }`}
      style={scrolled ? { background: 'rgba(0,0,0,0.88)' } : undefined}
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-12 flex items-center justify-between">
        <AnimatedLogo />

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="group relative font-inter text-nav-size text-white/50 hover:text-white transition-colors duration-300"
            >
              {l.label}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/55 scale-0 group-hover:scale-100 transition-transform duration-300" />
            </a>
          ))}
          <a
            href="mailto:bhaswati@example.com"
            className="font-inter text-label-sm font-medium px-5 py-2.5 rounded-full bg-white text-black hover:bg-accent transition-all duration-300 hover:shadow-[0_0_18px_rgba(255,255,255,0.22)]"
          >
            Hire Me
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-1 flex flex-col gap-[5px]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`h-px w-6 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`h-px w-6 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`h-px w-6 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ background: 'rgba(0,0,0,0.96)' }}
      >
        <nav className="flex flex-col px-8 py-6 gap-5">
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="font-clash font-semibold text-3xl text-white"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="mailto:bhaswati@example.com"
            className="font-inter text-sm font-medium px-5 py-3 rounded-full bg-white text-black text-center mt-2"
            onClick={() => setMenuOpen(false)}
          >
            Hire Me
          </a>
        </nav>
      </div>
    </header>
  );
}
