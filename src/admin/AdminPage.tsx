import { useEffect, useState, useCallback } from 'react';
import { LogOut, FolderOpen, MessageSquare, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import ProjectsManager from './components/ProjectsManager';
import SubmissionsView from './components/SubmissionsView';

type Tab = 'projects' | 'submissions';

function LoginForm({ onLogin }: { onLogin: (s: Session) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }
    if (data.session) onLogin(data.session);
  }

  const inputCls = "w-full bg-white/[0.05] border border-white/10 rounded-xl px-5 py-4 font-inter text-base text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <a href="/" className="flex items-center gap-2 font-inter text-sm text-white/30 hover:text-white transition-colors mb-10">
          <ArrowLeft size={14} /> Back to portfolio
        </a>
        <h1 className="font-clash font-bold text-4xl text-white mb-2">CMS Login</h1>
        <p className="font-inter text-sm text-white/30 mb-8">
          Sign in with your Supabase Auth account. Create one in your Supabase dashboard → Authentication → Users.
        </p>
        {error && <p className="font-inter text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded-xl mb-5">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className={inputCls} required />
          <button type="submit" disabled={loading}
            className="w-full bg-white text-black font-clash font-semibold text-base py-4 rounded-xl hover:bg-[#D9D9D9] transition-colors disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('projects');

  const tabs: { id: Tab; label: string; icon: typeof FolderOpen }[] = [
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'submissions', label: 'Submissions', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      {/* Top bar */}
      <header className="border-b border-white/[0.08] px-6 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xl" style={{ background: 'rgba(0,0,0,0.9)' }}>
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-2 font-inter text-xs text-white/30 hover:text-white transition-colors mr-2">
            <ArrowLeft size={12} /> Portfolio
          </a>
          <span className="font-clash font-bold text-lg text-white">CMS</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-inter text-xs text-white/30 hidden sm:block">{session.user.email}</span>
          <button onClick={onLogout} className="flex items-center gap-2 font-inter text-xs text-white/40 hover:text-white transition-colors">
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 rounded-xl border border-white/[0.07] w-fit" style={{ background: 'rgba(255,255,255,0.03)' }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-inter text-sm transition-colors ${tab === id ? 'bg-white text-black font-medium' : 'text-white/40 hover:text-white'}`}>
              <Icon size={14} />{label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'projects' && <ProjectsManager />}
        {tab === 'submissions' && <SubmissionsView />}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <LoginForm onLogin={setSession} />;
  return <Dashboard session={session} onLogout={handleLogout} />;
}
