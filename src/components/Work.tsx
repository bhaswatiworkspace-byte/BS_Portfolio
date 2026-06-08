import { useRef, useEffect } from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import type { Project } from '../types';

function getPrimaryMedia(project: Project) {
  const media = project.media ?? [];
  return media.find(m => m.is_primary) ?? media[0] ?? null;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const primary = getPrimaryMedia(project);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => el.classList.add('is-visible'), index * 120);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  const openLink = () => {
    if (project.external_url) window.open(project.external_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div ref={ref} className="reveal group cursor-pointer" onClick={openLink} data-hover>
      <div
        className="relative rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/20 transition-all duration-500 backdrop-blur-md"
        style={{ background: 'rgba(0,0,0,0.5)' }}
      >
        {/* Media */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {primary?.media_type === 'video' ? (
            <video
              src={primary.url}
              autoPlay loop muted playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <img
              src={primary?.url ?? 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1280'}
              alt={project.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors duration-500" />

          {/* External link button on hover */}
          {project.external_url && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-full text-sm font-medium font-inter">
                <ExternalLink size={14} />
                Visit Project
              </div>
            </div>
          )}

          <div className="absolute top-4 right-4 font-inter text-label-sm text-white/50 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md"
            style={{ background: 'rgba(0,0,0,0.5)' }}>
            {project.year}
          </div>
        </div>

        {/* Info */}
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <span className="font-inter text-label-sm text-accent tracking-widest uppercase block mb-2">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="font-clash font-bold text-2xl md:text-3xl text-white" style={{ letterSpacing: '-0.02em' }}>{project.title}</h3>
              <p className="font-inter text-label-sm text-white/40 mt-1">{project.subtitle}</p>
            </div>
            <ArrowUpRight
              size={20}
              className={`mt-1 text-white/25 group-hover:text-white transition-all duration-300 ${project.external_url ? 'group-hover:rotate-0 -rotate-45' : ''}`}
            />
          </div>

          <p className="font-inter text-label-sm text-white/30 leading-relaxed mb-5 line-clamp-2">{project.description}</p>

          {/* Extra media thumbnails */}
          {(project.media ?? []).length > 1 && (
            <div className="flex gap-2 mb-5">
              {(project.media ?? []).slice(0, 4).map((m, mi) => (
                <div key={m.id} className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                  {m.media_type === 'video'
                    ? <video src={m.url} className="w-full h-full object-cover" muted />
                    : <img src={m.url} alt="" className="w-full h-full object-cover" />
                  }
                </div>
              ))}
              {(project.media ?? []).length > 4 && (
                <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center">
                  <span className="font-inter text-[10px] text-white/30">+{(project.media ?? []).length - 4}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag}
                className="font-inter text-[11px] text-white/35 border border-white/[0.08] px-3 py-1.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.07] animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <div className="aspect-video bg-white/[0.04]" />
      <div className="p-8 space-y-3">
        <div className="h-3 w-16 bg-white/[0.06] rounded" />
        <div className="h-6 w-40 bg-white/[0.06] rounded" />
        <div className="h-3 w-56 bg-white/[0.04] rounded" />
      </div>
    </div>
  );
}

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const { projects, loading } = useProjects();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.reveal, .line-clip').forEach((item, i) => {
          if (!item.classList.contains('group'))
            setTimeout(() => item.classList.add('is-visible'), i * 80);
        });
        obs.disconnect();
      }
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="work" ref={sectionRef} className="relative z-20 py-24 md:py-36 px-8 md:px-12 border-t border-white/[0.06]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="reveal mb-4">
              <span className="font-inter text-label-sm text-accent tracking-[0.25em] uppercase">02 — Selected Work</span>
            </div>
            <div className="line-clip">
              <span className="font-clash font-bold text-section text-white block">Projects<span className="text-accent">.</span></span>
            </div>
          </div>
          <div className="reveal delay-200 max-w-xs">
            <p className="font-inter text-label-sm text-white/35 leading-relaxed">
              Click any project to visit the live site. Manage all projects via the <a href="/#admin" className="text-accent hover:text-white transition-colors underline underline-offset-2">CMS dashboard</a>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)
          }
        </div>
      </div>
    </section>
  );
}
