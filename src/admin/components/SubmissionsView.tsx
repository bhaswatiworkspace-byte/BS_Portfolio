import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { ContactSubmission } from '../../types';

export default function SubmissionsView() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setSubmissions((data as ContactSubmission[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2 className="font-clash font-semibold text-xl text-white mb-6">Contact Submissions</h2>
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />)}
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 border border-white/[0.07] rounded-xl">
          <p className="font-inter text-white/30">No submissions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map(s => (
            <div key={s.id} className="p-5 rounded-xl border border-white/[0.07] hover:border-white/15 transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-clash font-semibold text-base text-white">{s.name}</p>
                  <div className="flex flex-wrap gap-3 mt-1">
                    {s.email && <p className="font-inter text-xs text-white/40">{s.email}</p>}
                    {s.phone && <p className="font-inter text-xs text-white/40">{s.phone}</p>}
                  </div>
                </div>
                <p className="font-inter text-xs text-white/25 flex-shrink-0">
                  {new Date(s.created_at).toLocaleString()}
                </p>
              </div>
              <p className="font-inter text-sm text-white/55 leading-relaxed whitespace-pre-wrap">{s.message}</p>
              {s.email && (
                <a href={`mailto:${s.email}`}
                  className="inline-block mt-3 font-inter text-xs text-accent hover:text-white transition-colors">
                  Reply via email →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
