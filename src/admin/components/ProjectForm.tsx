import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Project, ProjectMedia } from '../../types';
import { sanitizeText } from '../../lib/sanitize';

interface Props {
  project?: Project | null;
  onSave: () => void;
  onCancel: () => void;
}

const EMPTY_MEDIA: Omit<ProjectMedia, 'id' | 'project_id' | 'created_at'> = {
  url: '', media_type: 'image', caption: '', is_primary: false, order_index: 0,
};

export default function ProjectForm({ project, onSave, onCancel }: Props) {
  const isEdit = !!project;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [fields, setFields] = useState({
    title: project?.title ?? '',
    subtitle: project?.subtitle ?? '',
    description: project?.description ?? '',
    external_url: project?.external_url ?? '',
    tags: project?.tags?.join(', ') ?? '',
    year: project?.year ?? String(new Date().getFullYear()),
    featured: project?.featured ?? false,
    order_index: project?.order_index ?? 0,
  });

  const [mediaList, setMediaList] = useState<Array<typeof EMPTY_MEDIA & { id?: string }>>(
    project?.media?.map(m => ({ id: m.id, url: m.url, media_type: m.media_type, caption: m.caption, is_primary: m.is_primary, order_index: m.order_index })) ?? []
  );

  const set = (k: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields(f => ({ ...f, [k]: e.target.value }));
  const setCheck = (k: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields(f => ({ ...f, [k]: e.target.checked }));

  function addMedia() { setMediaList(m => [...m, { ...EMPTY_MEDIA, order_index: m.length }]); }
  function removeMedia(i: number) { setMediaList(m => m.filter((_, idx) => idx !== i)); }
  function setMedia(i: number, k: keyof typeof EMPTY_MEDIA, v: string | boolean) {
    setMediaList(m => m.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields.title.trim()) { setError('Title is required'); return; }
    setSaving(true); setError('');

    const payload = {
      title: sanitizeText(fields.title, 200),
      subtitle: sanitizeText(fields.subtitle, 300),
      description: sanitizeText(fields.description, 2000),
      external_url: fields.external_url.trim(),
      tags: fields.tags.split(',').map(t => t.trim()).filter(Boolean),
      year: fields.year.trim(),
      featured: fields.featured,
      order_index: Number(fields.order_index),
      updated_at: new Date().toISOString(),
    };

    try {
      let projectId = project?.id;

      if (isEdit) {
        const { error: e } = await supabase.from('projects').update(payload).eq('id', projectId!);
        if (e) throw e;
        // Delete all existing media then re-insert
        await supabase.from('project_media').delete().eq('project_id', projectId!);
      } else {
        const { data, error: e } = await supabase.from('projects').insert([payload]).select().single();
        if (e) throw e;
        projectId = data.id;
      }

      if (mediaList.length > 0) {
        const mediaPayload = mediaList.map((m, i) => ({
          project_id: projectId,
          url: m.url.trim(),
          media_type: m.media_type,
          caption: sanitizeText(m.caption, 300),
          is_primary: m.is_primary,
          order_index: i,
        })).filter(m => m.url);
        if (mediaPayload.length > 0) {
          const { error: me } = await supabase.from('project_media').insert(mediaPayload);
          if (me) throw me;
        }
      }

      onSave();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-3 font-inter text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="font-clash font-semibold text-xl text-white">{isEdit ? 'Edit Project' : 'Add Project'}</h2>

      {error && <p className="font-inter text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded-lg">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-inter text-xs text-white/40 mb-1.5 uppercase tracking-widest">Title *</label>
          <input className={inputCls} value={fields.title} onChange={set('title')} placeholder="Project title" />
        </div>
        <div>
          <label className="block font-inter text-xs text-white/40 mb-1.5 uppercase tracking-widest">Subtitle</label>
          <input className={inputCls} value={fields.subtitle} onChange={set('subtitle')} placeholder="Short tagline" />
        </div>
      </div>

      <div>
        <label className="block font-inter text-xs text-white/40 mb-1.5 uppercase tracking-widest">Description</label>
        <textarea className={inputCls + ' resize-none'} value={fields.description} onChange={set('description')} rows={4} placeholder="Project description" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-inter text-xs text-white/40 mb-1.5 uppercase tracking-widest">External URL</label>
          <input className={inputCls} value={fields.external_url} onChange={set('external_url')} placeholder="https://example.com" type="url" />
        </div>
        <div>
          <label className="block font-inter text-xs text-white/40 mb-1.5 uppercase tracking-widest">Year</label>
          <input className={inputCls} value={fields.year} onChange={set('year')} placeholder="2024" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-inter text-xs text-white/40 mb-1.5 uppercase tracking-widest">Tags (comma separated)</label>
          <input className={inputCls} value={fields.tags} onChange={set('tags')} placeholder="React, TypeScript, Design" />
        </div>
        <div>
          <label className="block font-inter text-xs text-white/40 mb-1.5 uppercase tracking-widest">Order</label>
          <input className={inputCls} type="number" value={fields.order_index} onChange={set('order_index')} />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={fields.featured} onChange={setCheck('featured')} className="w-4 h-4 accent-white" />
        <span className="font-inter text-sm text-white/60">Featured project</span>
      </label>

      {/* Media */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="font-inter text-xs text-white/40 uppercase tracking-widest">Media (Images / Videos)</label>
          <button type="button" onClick={addMedia} className="font-inter text-xs text-accent hover:text-white transition-colors">+ Add</button>
        </div>
        <div className="space-y-3">
          {mediaList.map((m, i) => (
            <div key={i} className="flex gap-3 items-start p-3 rounded-lg border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input className={inputCls + ' sm:col-span-2'} placeholder="URL (image or video)" value={m.url} onChange={e => setMedia(i, 'url', e.target.value)} />
                <select
                  className={inputCls}
                  value={m.media_type}
                  onChange={e => setMedia(i, 'media_type', e.target.value as 'image' | 'video')}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
                <input className={inputCls + ' sm:col-span-2'} placeholder="Caption (optional)" value={m.caption} onChange={e => setMedia(i, 'caption', e.target.value)} />
                <label className="flex items-center gap-2 px-2 cursor-pointer">
                  <input type="checkbox" checked={m.is_primary} onChange={e => setMedia(i, 'is_primary', e.target.checked)} className="accent-white" />
                  <span className="font-inter text-xs text-white/40">Primary</span>
                </label>
              </div>
              <button type="button" onClick={() => removeMedia(i)} className="text-white/20 hover:text-red-400 transition-colors mt-1 flex-shrink-0">✕</button>
            </div>
          ))}
          {mediaList.length === 0 && (
            <p className="font-inter text-xs text-white/20 text-center py-4">No media — click + Add to attach images or videos</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="flex-1 bg-white text-black font-clash font-semibold text-sm py-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : isEdit ? 'Update Project' : 'Create Project'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-6 py-3 rounded-lg border border-white/10 font-inter text-sm text-white/50 hover:text-white hover:border-white/25 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
