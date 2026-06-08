import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Project } from '../types';

const FALLBACK: Project[] = [
  {
    id: 'f1', title: 'Morphic', subtitle: 'Interactive Brand Experience',
    description: 'Award-winning immersive 3D brand experience for a global tech startup. Real-time particle simulations and custom shader effects.',
    external_url: 'https://example.com', tags: ['WebGL', 'Three.js', 'Creative Dev'],
    year: '2024', featured: true, order_index: 1, created_at: '', updated_at: '',
    media: [{ id: 'm1', project_id: 'f1', url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1280', media_type: 'image', caption: '', is_primary: true, order_index: 1, created_at: '' }],
  },
  {
    id: 'f2', title: 'Lumina', subtitle: 'Luxury E-Commerce Platform',
    description: 'Motion-driven luxury e-commerce platform with custom physics-based scroll and 3D product configurator.',
    external_url: 'https://example.com', tags: ['React', 'Motion', 'Design'],
    year: '2024', featured: true, order_index: 2, created_at: '', updated_at: '',
    media: [{ id: 'm2', project_id: 'f2', url: 'https://images.pexels.com/photos/5632388/pexels-photo-5632388.jpeg?auto=compress&cs=tinysrgb&w=1280', media_type: 'image', caption: '', is_primary: true, order_index: 1, created_at: '' }],
  },
  {
    id: 'f3', title: 'Prism', subtitle: 'Data Visualization Dashboard',
    description: 'Real-time analytics dashboard for a FinTech company. Custom SVG animations and live data streaming.',
    external_url: 'https://example.com', tags: ['D3.js', 'TypeScript', 'Data Viz'],
    year: '2023', featured: false, order_index: 3, created_at: '', updated_at: '',
    media: [{ id: 'm3', project_id: 'f3', url: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1280', media_type: 'image', caption: '', is_primary: true, order_index: 1, created_at: '' }],
  },
  {
    id: 'f4', title: 'Vanta', subtitle: 'Architecture Studio Identity',
    description: 'Full digital identity and web presence for an award-winning architecture firm with cinematic transitions.',
    external_url: 'https://example.com', tags: ['Design', 'Development', 'Branding'],
    year: '2023', featured: false, order_index: 4, created_at: '', updated_at: '',
    media: [{ id: 'm4', project_id: 'f4', url: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1280', media_type: 'image', caption: '', is_primary: true, order_index: 1, created_at: '' }],
  },
];

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('projects')
        .select('*, media:project_media(*)')
        .order('order_index', { ascending: true });
      if (err) throw err;
      setProjects(data && data.length > 0 ? data : FALLBACK);
      setError(null);
    } catch {
      setError('Failed to load projects');
      setProjects(FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refetch(); }, []);

  return { projects, loading, error, refetch };
}
