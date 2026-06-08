import { useEffect, useRef } from 'react';

interface InViewOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useInView(options: InViewOptions = {}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin ?? '0px 0px -60px 0px',
      }
    );

    const targets = el.querySelectorAll('.reveal, .reveal-left, .line-clip');
    targets.forEach((t) => observer.observe(t));
    if (el.classList.contains('reveal') || el.classList.contains('line-clip')) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return ref;
}
