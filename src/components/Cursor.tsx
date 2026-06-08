import { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const outerPosRef = useRef({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const animate = () => {
      const target = posRef.current;
      const current = outerPosRef.current;
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${current.x - 20}px, ${current.y - 20}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    const handleEnter = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest('a, button, [data-hover]')) setIsHovering(true);
    };
    const handleLeave = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest('a, button, [data-hover]')) setIsHovering(false);
    };
    const handleDown = () => setIsClicking(true);
    const handleUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseover', handleEnter);
    document.addEventListener('mouseout', handleLeave);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleEnter);
      document.removeEventListener('mouseout', handleLeave);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  return (
    <>
      <div
        ref={outerRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none will-change-transform hidden md:block"
        style={{
          width: isHovering ? 56 : 40,
          height: isHovering ? 56 : 40,
          borderRadius: '50%',
          border: `1.5px solid ${isHovering ? '#d4ff00' : 'rgba(240,240,240,0.5)'}`,
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, margin 0.3s ease',
          marginLeft: isHovering ? -8 : 0,
          marginTop: isHovering ? -8 : 0,
          mixBlendMode: 'difference',
        }}
      />
      <div
        ref={innerRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none will-change-transform hidden md:block"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: isClicking ? '#d4ff00' : '#f0f0f0',
          transition: 'background 0.15s ease',
          mixBlendMode: 'difference',
        }}
      />
    </>
  );
}
