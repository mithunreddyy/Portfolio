import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAL_INFO, PROJECTS, EXPERIENCES, BLOG_POSTS } from '../constants';
import { BlogPost, Project, Experience, PersonalInfo } from '../types';
import { 
  Plus, Trash2, Edit3, Save, X, ExternalLink, LogIn, LogOut, ShieldAlert, 
  User as UserIcon, Briefcase, Code, BookOpen, Settings, Check, AlertCircle, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth, db, login, logout, handleFirestoreError, OperationType } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';

const ADMIN_EMAIL = 'mithunreddy1357@gmail.com';

type Tab = 'profile' | 'projects' | 'experience' | 'blogs';

export function CMS() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('blogs');
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Data States
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(PERSONAL_INFO);

  // Form States
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({});
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});
  const [experienceForm, setExperienceForm] = useState<Partial<Experience>>({});
  const [profileForm, setProfileForm] = useState<PersonalInfo>(PERSONAL_INFO);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    // Subscriptions
    const unsubBlogs = onSnapshot(query(collection(db, 'blogs'), orderBy('date', 'desc')), (s) => {
      setBlogs(s.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost)));
    });

    const unsubProjects = onSnapshot(collection(db, 'projects'), (s) => {
      setProjects(s.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
    });

    const unsubExp = onSnapshot(collection(db, 'experience'), (s) => {
      setExperiences(s.docs.map(d => ({ id: d.id, ...d.data() } as Experience)));
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'general'), (d) => {
      if (d.exists()) {
        setPersonalInfo(d.data() as PersonalInfo);
        setProfileForm(d.data() as PersonalInfo);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubBlogs();
      unsubProjects();
      unsubExp();
      unsubSettings();
    };
  }, []);

  const isAdmin = user?.email === ADMIN_EMAIL;

  // Seeding Function
  const seedData = async () => {
    if (!isAdmin) return;
    try {
      // Seed Settings
      await setDoc(doc(db, 'settings', 'general'), PERSONAL_INFO);
      
      // Seed Projects
      for (const p of PROJECTS) {
        await setDoc(doc(db, 'projects', p.id), p);
      }
      
      // Seed Experience
      for (const e of EXPERIENCES) {
        await setDoc(doc(db, 'experience', e.id), e);
      }
      
      // Seed Blogs
      for (const b of BLOG_POSTS) {
        await setDoc(doc(db, 'blogs', b.id), b);
      }
      
      alert('Database seeded successfully from local constants!');
    } catch (e) {
      console.error(e);
      alert('Seeding failed. Check console.');
    }
  };

  // CRUD Handlers
  const handleSaveProfile = async () => {
    try {
      await setDoc(doc(db, 'settings', 'general'), profileForm);
      alert('Profile updated!');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'settings/general');
    }
  };

  const handleSaveBlog = async () => {
    const id = editingId || Math.random().toString(36).substring(7);
    const data = { ...blogForm, id, date: blogForm.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() };
    try {
      await setDoc(doc(db, 'blogs', id), data);
      setIsAdding(false);
      setEditingId(null);
      setBlogForm({});
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `blogs/${id}`);
    }
  };

  const handleSaveProject = async () => {
    const id = editingId || Math.random().toString(36).substring(7);
    try {
      await setDoc(doc(db, 'projects', id), { ...projectForm, id });
      setIsAdding(false);
      setEditingId(null);
      setProjectForm({});
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `projects/${id}`);
    }
  };

  const handleSaveExperience = async () => {
    const id = editingId || Math.random().toString(36).substring(7);
    try {
      await setDoc(doc(db, 'experience', id), { ...experienceForm, id });
      setIsAdding(false);
      setEditingId(null);
      setExperienceForm({});
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `experience/${id}`);
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `${collectionName}/${id}`);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!user) return <LoginScreen onLogin={login} />;
  if (!isAdmin) return <AccessDeniedScreen user={user} onLogout={logout} />;

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-ink/[0.02] border-b md:border-b-0 md:border-r border-ink/[0.05] p-6 flex flex-col gap-8 shrink-0">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-accent/20">M</div>
          <span className="font-bold tracking-tight text-lg">Admin Console</span>
        </div>

        <nav className="flex flex-col gap-1">
          <SidebarLink icon={<UserIcon size={18}/>} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          <SidebarLink icon={<Code size={18}/>} label="Projects" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
          <SidebarLink icon={<Briefcase size={18}/>} label="Experience" active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} />
          <SidebarLink icon={<BookOpen size={18}/>} label="Blog" active={activeTab === 'blogs'} onClick={() => setActiveTab('blogs')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-ink/[0.05] space-y-4">
          <button onClick={seedData} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted/40 hover:text-accent transition-colors">
            <RefreshCw size={14} /> Seed Data
          </button>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted/40 hover:text-red-500 transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
          <Link to="/" className="block px-4 py-3 text-[10px] font-bold text-muted/30 uppercase tracking-[0.3em] hover:text-ink">
            ← View Site
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8 md:p-16">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-bold tracking-tight capitalize">{activeTab}</h1>
              <p className="text-muted/50 text-sm">Manage your dynamic portfolio content</p>
            </div>
            {activeTab !== 'profile' && !isAdding && (
              <button 
                onClick={() => { setIsAdding(true); setEditingId(null); setBlogForm({}); setProjectForm({}); setExperienceForm({}); }}
                className="px-6 py-3 bg-ink text-bg rounded-xl font-bold text-xs flex items-center gap-2 uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
              >
                <Plus size={16} /> Add New
              </button>
            )}
          </header>

          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-ink/[0.03] p-8 rounded-3xl border border-ink/[0.05]"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold">{editingId ? 'Edit Item' : 'New Item'}</h2>
                  <button onClick={() => setIsAdding(false)} className="p-2 text-muted/40 hover:text-ink"><X size={20} /></button>
                </div>

                {activeTab === 'blogs' && <BlogForm form={blogForm} setForm={setBlogForm} onSave={handleSaveBlog} />}
                {activeTab === 'projects' && <ProjectForm form={projectForm} setForm={setProjectForm} onSave={handleSaveProject} />}
                {activeTab === 'experience' && <ExperienceForm form={experienceForm} setForm={setExperienceForm} onSave={handleSaveExperience} />}
              </motion.div>
            ) : (
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
              >
                {activeTab === 'profile' && <ProfileSection form={profileForm} setForm={setProfileForm} onSave={handleSaveProfile} />}
                {activeTab === 'blogs' && <ListSection items={blogs} onEdit={(b) => { setBlogForm(b); setEditingId(b.id); setIsAdding(true); }} onDelete={(id) => handleDelete('blogs', id)} titleKey="title" />}
                {activeTab === 'projects' && <ListSection items={projects} onEdit={(p) => { setProjectForm(p); setEditingId(p.id); setIsAdding(true); }} onDelete={(id) => handleDelete('projects', id)} titleKey="title" />}
                {activeTab === 'experience' && <ListSection items={experiences} onEdit={(e) => { setExperienceForm(e); setEditingId(e.id); setIsAdding(true); }} onDelete={(id) => handleDelete('experience', id)} titleKey="company" subtitleKey="role" />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Sub-components
function SidebarLink({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        active ? 'bg-ink text-bg shadow-lg shadow-ink/10' : 'text-muted/60 hover:bg-ink/[0.05] hover:text-ink'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function ProfileSection({ form, setForm, onSave }: any) {
  const fields = [
    { key: 'name', label: 'Full Name' },
    { key: 'role', label: 'Headline Role' },
    { key: 'location', label: 'Location' },
    { key: 'email', label: 'Contact Email' },
    { key: 'github', label: 'GitHub Username' },
    { key: 'linkedin', label: 'LinkedIn Username' },
    { key: 'summary', label: 'Bio Summary', area: true },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(f => (
          <div key={f.key} className={`space-y-2 ${f.area ? 'md:col-span-2' : ''}`}>
            <label className="text-[10px] font-bold text-muted/40 uppercase tracking-widest">{f.label}</label>
            {f.area ? (
              <textarea 
                value={form[f.key]} 
                onChange={e => setForm({...form, [f.key]: e.target.value})}
                className="w-full bg-ink/[0.05] rounded-xl p-4 text-ink h-32 resize-none outline-none focus:bg-ink/[0.08]"
              />
            ) : (
              <input 
                type="text" 
                value={form[f.key]} 
                onChange={e => setForm({...form, [f.key]: e.target.value})}
                className="w-full bg-ink/[0.05] rounded-xl p-4 text-ink outline-none focus:bg-ink/[0.08]"
              />
            )}
          </div>
        ))}
      </div>
      <button onClick={onSave} className="px-10 py-4 bg-accent text-white rounded-2xl font-bold text-xs flex items-center gap-3 uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
        <Save size={18} /> Update Profile
      </button>
    </div>
  );
}

function ListSection({ items, onEdit, onDelete, titleKey, subtitleKey }: any) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {items.length === 0 && <p className="text-muted/40 text-center py-20 italic">No entries found. Seed data or add new.</p>}
      {items.map((item: any) => (
        <div key={item.id} className="p-6 bg-ink/[0.03] rounded-2xl flex items-center justify-between group hover:bg-ink/[0.05] transition-all">
          <div>
            <h3 className="font-bold text-ink">{item[titleKey]}</h3>
            {subtitleKey && <p className="text-xs text-muted/50 mt-1">{item[subtitleKey]}</p>}
            {!subtitleKey && <p className="text-[10px] text-muted/30 font-mono mt-1">ID: {item.id}</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(item)} className="p-3 bg-bg rounded-xl text-muted/60 hover:text-accent shadow-sm"><Edit3 size={16}/></button>
            <button onClick={() => onDelete(item.id)} className="p-3 bg-bg rounded-xl text-muted/60 hover:text-red-500 shadow-sm"><Trash2 size={16}/></button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Form Components
function BlogForm({ form, setForm, onSave }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Title" value={form.title} onChange={v => setForm({...form, title: v})} />
        <Input label="Slug" value={form.slug} onChange={v => setForm({...form, slug: v})} />
        <Input label="Category" value={form.category} onChange={v => setForm({...form, category: v})} />
        <Input label="Read Time" value={form.readTime} onChange={v => setForm({...form, readTime: v})} />
        <Textarea label="Excerpt" value={form.excerpt} onChange={v => setForm({...form, excerpt: v})} className="md:col-span-2 h-24" />
        <Textarea label="Content" value={form.content} onChange={v => setForm({...form, content: v})} className="md:col-span-2 h-64" />
      </div>
      <SaveButton onClick={onSave} />
    </div>
  );
}

function ProjectForm({ form, setForm, onSave }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Title" value={form.title} onChange={v => setForm({...form, title: v})} />
        <Input label="Repo/Demo Link" value={form.link} onChange={v => setForm({...form, link: v})} />
        <Input label="Tech Stack (comma separated)" value={form.tech?.join(', ')} onChange={v => setForm({...form, tech: v.split(',').map(t => t.trim())})} />
        <Textarea label="Descriptions (one per line)" value={form.description?.join('\n')} onChange={v => setForm({...form, description: v.split('\n')})} className="md:col-span-2 h-40" />
      </div>
      <SaveButton onClick={onSave} />
    </div>
  );
}

function ExperienceForm({ form, setForm, onSave }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Role" value={form.role} onChange={v => setForm({...form, role: v})} />
        <Input label="Company" value={form.company} onChange={v => setForm({...form, company: v})} />
        <Input label="Location" value={form.location} onChange={v => setForm({...form, location: v})} />
        <Input label="Period (e.g. 2022 - Present)" value={form.period} onChange={v => setForm({...form, period: v})} />
        <Textarea label="Highlights (one per line)" value={form.highlights?.join('\n')} onChange={v => setForm({...form, highlights: v.split('\n')})} className="md:col-span-2 h-40" />
      </div>
      <SaveButton onClick={onSave} />
    </div>
  );
}

// UI Helpers
function Input({ label, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-muted/40 uppercase tracking-widest">{label}</label>
      <input 
        type="text" 
        value={value || ''} 
        onChange={e => onChange(e.target.value)}
        className="w-full bg-ink/[0.05] rounded-xl p-4 text-ink outline-none focus:bg-ink/[0.08]"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, className }: any) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-[10px] font-bold text-muted/40 uppercase tracking-widest">{label}</label>
      <textarea 
        value={value || ''} 
        onChange={e => onChange(e.target.value)}
        className="w-full h-full bg-ink/[0.05] rounded-xl p-4 text-ink outline-none focus:bg-ink/[0.08] resize-none"
      />
    </div>
  );
}

function SaveButton({ onClick }: any) {
  return (
    <button onClick={onClick} className="px-10 py-4 bg-accent text-white rounded-2xl font-bold text-xs flex items-center gap-3 uppercase tracking-widest shadow-xl hover:scale-105 transition-all ml-auto">
      <Save size={18} /> Save Entry
    </button>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-12 h-12 bg-accent/20 rounded-full blur-xl" />
    </div>
  );
}

function LoginScreen({ onLogin }: any) {
  return (
    <div className="min-h-screen bg-bg text-ink flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Admin CMS</h1>
          <p className="text-muted/60">Manage your portfolio details and blog content dynamically.</p>
        </div>
        <button onClick={onLogin} className="w-full px-8 py-4 bg-accent text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-3 uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all">
          <LogIn size={18} /> Sign in with Google
        </button>
        <Link to="/" className="block text-[10px] font-bold text-muted/40 uppercase tracking-[0.4em] hover:text-ink">← Back to Portfolio</Link>
      </div>
    </div>
  );
}

function AccessDeniedScreen({ user, onLogout }: any) {
  return (
    <div className="min-h-screen bg-bg text-ink flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="p-4 bg-red-500/10 rounded-full text-red-500 w-20 h-20 flex items-center justify-center mx-auto"><ShieldAlert size={40} /></div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="text-muted/60">Email: <span className="text-ink font-mono">{user.email}</span></p>
        </div>
        <button onClick={onLogout} className="w-full px-8 py-4 bg-bg rounded-2xl font-bold text-xs flex items-center justify-center gap-3 uppercase tracking-widest hover:bg-ink hover:text-bg transition-all shadow-md">
          <LogOut size={18} /> Sign Out
        </button>
        <Link to="/" className="block text-[10px] font-bold text-muted/40 uppercase tracking-[0.4em] hover:text-ink">← Back to Portfolio</Link>
      </div>
    </div>
  );
}
