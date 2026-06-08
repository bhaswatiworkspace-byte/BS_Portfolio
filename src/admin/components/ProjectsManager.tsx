import { useState } from 'react';
import { Pencil, Trash2, ExternalLink, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useProjects } from '../../hooks/useProjects';
import type { Project } from '../../types';
import ProjectForm from './ProjectForm';

export default function ProjectsManager() {
  const { projects, loading, refetch } = useProjects();
  const [editing, setEditing] = useState<Project | null | 'new'>( null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    setDeleting(id);
    await supabase.from('projects').delete().eq('id', id);
    await refetch();
    setDeleting(null);
  }

  if (editing !== null) {
    return (
      <ProjectForm
        project={editing === 'new' ? null : editing}
        onSave={async () => { await refetch(); setEditing(null); }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-clash font-semibold text-xl text-white">Projects</h2>
        <button
          onClick={() => setEditing('new')}
          className="flex items-center gap-2 bg-white text-black font-inter text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-accent transition-colors"
        >
          <Plus size={14} />
          New Project
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 border border-white/[0.07] rounded-xl">
          <p className="font-inter text-white/30 mb-4">No projects yet</p>
          <button onClick={() => setEditing('new')} className="font-inter text-sm text-accent hover:text-white transition-colors">Add your first project →</button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(p => {
            const primary = p.media?.find(m => m.is_primary) ?? p.media?.[0];
            return (
              <div key={p.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.07] hover:border-white/15 transition-colors"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-white/[0.07]">
                  {primary?.media_type === 'video'
                    ? <video src={primary.url} className="w-full h-full object-cover" muted />
                    : primary
                      ? <img src={primary.url} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-white/[0.05]" />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-clash font-semibold text-base text-white truncate">{p.title}</p>
                    {p.featured && <span className="font-inter text-[10px] text-accent border border-accent/30 px-2 py-0.5 rounded-full">Featured</span>}
                  </div>
                  <p className="font-inter text-xs text-white/30 truncate">{p.subtitle} · {p.year} · {p.media?.length ?? 0} media</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {p.external_url && (
                    <a href={p.external_url} target="_blank" rel="noopener noreferrer"
                      className="p-2 text-white/25 hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]">
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button onClick={() => setEditing(p)}
                    className="p-2 text-white/25 hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                    className="p-2 text-white/25 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10 disabled:opacity-40">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
