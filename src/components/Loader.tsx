import { useEffect, useState } from 'react';

export default function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    let frame = 0;
    const TOTAL = 80;
    const tick = () => {
      frame++;
      setProgress(Math.min(100, Math.round((frame / TOTAL) * 100)));
      if (frame < TOTAL) setTimeout(tick, 16);
      else setTimeout(() => { setHiding(true); setTimeout(onDone, 600); }, 200);
    };
    const id = setTimeout(tick, 100);
    return () => clearTimeout(id);
  }, [onDone]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-opacity duration-700 ${hiding ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <p className="font-clash font-bold text-[18vw] leading-none text-white select-none" style={{ letterSpacing: '-0.05em' }}>
        {String(progress).padStart(2, '0')}
        <span className="text-accent">%</span>
      </p>
      <div className="absolute bottom-10 left-10 font-inter text-xs text-white/30 tracking-[0.2em] uppercase">Loading</div>
      <div className="absolute bottom-10 right-10 font-inter text-xs text-white/30 tracking-[0.2em] uppercase">Bhaswati Sengupta</div>
      <div className="absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-75" style={{ width: `${progress}%` }} />
    </div>
  );
}
