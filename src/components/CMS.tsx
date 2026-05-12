import {
  AlertCircle,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Database,
  Edit2,
  ExternalLink,
  FileText,
  Globe,
  LayoutDashboard,
  Link as LinkIcon,
  LogOut,
  Mail,
  MapPin,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Terminal,
  Trash2,
  User as UserIcon,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useState } from "react";
import { PERSONAL_INFO, PROJECTS, EXPERIENCES, BLOG_POSTS } from "../constants";
import { supabase } from "../lib/supabase";
import { BlogPost, Experience, PersonalInfo, Project } from "../types";
import { formatDate, calculateReadTime } from "../lib/utils";

const ADMIN_EMAIL = "mithunreddy1357@gmail.com";

type Tab = "profile" | "projects" | "experience" | "blogs";

// --- TOAST SYSTEM ---
type ToastType = "success" | "error" | "info";
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export function CMS() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const [profile, setProfile] = useState<PersonalInfo>(PERSONAL_INFO);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mobile sidebar state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = useCallback(async (silent = false) => {
    if (!user) return;
    if (!silent) setLoading(true);
    try {
      const [{ data: prof }, { data: projs }, { data: exps }, { data: bgs }] =
        await Promise.all([
          supabase.from("profile").select("*").single(),
          supabase.from("projects").select("*").order("order_index"),
          supabase.from("experience").select("*").order("order_index"),
          supabase
            .from("blogs")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

      if (prof) {
        setProfile({
          ...PERSONAL_INFO,
          ...prof,
          birthYear: prof.birth_year || PERSONAL_INFO.birthYear,
          resumeUrl: prof.resume_url || PERSONAL_INFO.resumeUrl,
        });
      }

      if (Array.isArray(projs)) {
        setProjects(
          projs.map((project: any) => ({
            ...project,
            description: Array.isArray(project.description)
              ? project.description
              : [project.description],
            tech: Array.isArray(project.tech) ? project.tech : [project.tech],
          })),
        );
      }

      if (Array.isArray(exps)) {
        setExperiences(
          exps.map((experience: any) => ({
            ...experience,
            highlights: Array.isArray(experience.highlights)
              ? experience.highlights
              : [experience.highlights],
          })),
        );
      }

      if (Array.isArray(bgs)) {
        setBlogs(
          bgs.map((blog: any) => ({
            ...blog,
            date: formatDate(blog.date || blog.created_at),
            readTime: calculateReadTime(blog.content, blog.excerpt),
          })),
        );
      }

      if (!silent) showToast("Workspace synchronized.", "success");
    } catch (err: any) {
      if (err.code !== "PGRST116") {
        console.warn("Supabase Sync:", err.message);
      }
      showToast("Unable to fetch CMS data.", "error");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchData(true);
  }, [user, fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email !== ADMIN_EMAIL) {
      showToast("Unauthorized access.", "error");
      return;
    }
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin + "/cms" },
      });
      if (error) throw error;
      setMagicLinkSent(true);
    } catch (err: any) {
      showToast(err.message || "Authentication failed.", "error");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleUpsertItem = async (table: string, data: any) => {
    setActionLoading(true);

    if (table === "projects" && !data.title) {
      showToast("Project title is required.", "error");
      setActionLoading(false);
      return;
    }
    if (table === "experience" && (!data.role || !data.company)) {
      showToast("Experience role and company are required.", "error");
      setActionLoading(false);
      return;
    }
    if (table === "blogs" && (!data.title || !data.slug)) {
      showToast("Blog title and slug are required.", "error");
      setActionLoading(false);
      return;
    }

    try {
      const payload: any = {};
      if (data.id && data.id !== "") payload.id = data.id;

      if (table === "profile") {
        payload.id = "main";
        payload.name = data.name;
        payload.role = data.role;
        payload.location = data.location;
        payload.email = data.email;
        payload.summary = data.summary;
        payload.birth_year = data.birthYear;
        payload.resume_url = data.resumeUrl;
      } else if (table === "projects") {
        payload.title = data.title;
        payload.description = Array.isArray(data.description)
          ? data.description
          : [data.description];
        payload.tech = Array.isArray(data.tech) ? data.tech : [data.tech];
        payload.link = data.link || "";
        payload.demo_url = data.demo_url || "";
        payload.order_index = data.order_index || 0;
      } else if (table === "experience") {
        payload.role = data.role;
        payload.company = data.company;
        payload.location = data.location || "";
        payload.period = data.period || "";
        payload.highlights = Array.isArray(data.highlights)
          ? data.highlights
          : [data.highlights];
        payload.order_index = data.order_index || 0;
      } else if (table === "blogs") {
        payload.title = data.title;
        payload.slug = data.slug;
        payload.excerpt = data.excerpt || "";
        payload.content = data.content || "";
        payload.category = data.category || "";
        payload.published =
          typeof data.published === "boolean" ? data.published : true;
        payload.date = data.date || new Date().toISOString();
        payload.read_time = calculateReadTime(data.content, data.excerpt);
      }

      payload.updated_at = new Date().toISOString();

      const { error } = await supabase.from(table).upsert(payload);
      if (error) throw error;

      showToast(`Successfully saved ${table.slice(0, -1)}.`, "success");
      setIsDrawerOpen(false);
      setEditingItem(null);
      fetchData(true);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const migrateStaticData = async () => {
    if (!window.confirm("This will copy all missing hardcoded projects, experiences, and blogs into the database. Proceed?")) return;
    setActionLoading(true);
    try {
      // 1. Projects
      const newProjects = PROJECTS.filter(p => !projects.some(dbP => dbP.title === p.title));
      if (newProjects.length > 0) {
        const projectPayloads = newProjects.map((p, index) => ({
          title: p.title, description: p.description, tech: p.tech,
          link: p.link, demo_url: p.demoUrl,
          order_index: (p as any).order_index || (projects.length + index)
        }));
        const { error } = await supabase.from('projects').insert(projectPayloads);
        if (error) throw new Error("Projects Migration: " + error.message);
      }

      // 2. Experiences
      const newExps = EXPERIENCES.filter(e => !experiences.some(dbE => dbE.role === e.role && dbE.company === e.company));
      if (newExps.length > 0) {
        const expPayloads = newExps.map((e, index) => ({
          role: e.role, company: e.company, period: e.period, location: e.location,
          highlights: e.highlights, order_index: (e as any).order_index || (experiences.length + index)
        }));
        const { error } = await supabase.from('experience').insert(expPayloads);
        if (error) throw new Error("Experiences Migration: " + error.message);
      }

      // 3. Blogs
      const newBlogs = BLOG_POSTS.filter(b => !blogs.some(dbB => dbB.slug === b.slug));
      if (newBlogs.length > 0) {
        const blogPayloads = newBlogs.map(b => ({
          slug: b.slug, title: b.title, excerpt: b.excerpt,
          content: b.content, read_time: b.readTime, published: true,
          created_at: new Date(b.date).toISOString()
        }));
        const { error } = await supabase.from('blogs').insert(blogPayloads);
        if (error) throw new Error("Blogs Migration: " + error.message);
      }

      showToast(`Migration successful! Added ${newProjects.length} projects, ${newExps.length} experiences, and ${newBlogs.length} blogs.`, "success");
      fetchData(true);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm("Are you sure you want to permanently delete this record? This action cannot be undone.")) return;
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      showToast("Record successfully removed.", "info");
      fetchData(true);
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const filteredProjects = projects.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredExperiences = experiences.filter((e) => e.role.toLowerCase().includes(searchQuery.toLowerCase()) || e.company.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredBlogs = blogs.filter((b) => b.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Keyboard shortcut for creating new items
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("cms-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border border-ink/10 rounded-2xl animate-spin" style={{ animationDuration: '3s' }} />
          <div className="w-10 h-10 border border-ink/20 rounded-xl absolute animate-spin-reverse" style={{ animationDuration: '2s' }} />
          <Terminal size={16} className="absolute text-ink/40" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold text-ink uppercase tracking-[0.4em]">Initializing</span>
          <span className="text-[11px] text-muted">Establishing secure connection...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6 selection:bg-accent/20">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          className="w-full max-w-sm bg-ink/[0.02] backdrop-blur-3xl border border-line rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-50" />
          
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-ink/[0.04] border border-line rounded-[20px] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Terminal className="text-ink/80" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-ink mb-2 tracking-tight">Admin Console</h1>
            <p className="text-muted text-[13px]">
              Authenticate to access the workspace
            </p>
          </div>

          {magicLinkSent ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6 bg-ink/[0.02] border border-line rounded-2xl">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-ink font-semibold">Magic Link Sent</p>
              <p className="text-muted text-[13px] px-6 mt-2 leading-relaxed">
                Check your inbox. Click the link to securely sign in.
              </p>
              <button
                onClick={() => setMagicLinkSent(false)}
                className="mt-6 text-[11px] font-semibold text-muted hover:text-ink transition-colors uppercase tracking-widest"
              >
                Use different email
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-muted uppercase tracking-widest pl-1">Admin Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-accent" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@domain.com"
                    className="w-full bg-ink/[0.03] border border-line rounded-2xl py-4 pl-12 pr-4 text-[15px] text-ink placeholder:text-muted/30 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all"
                    required
                  />
                </div>
              </div>
              <button
                disabled={authLoading}
                className="w-full bg-ink text-bg font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
              >
                {authLoading ? (
                  <RefreshCw className="animate-spin" size={18} />
                ) : (
                  <>Continue with Email <ChevronRight size={16} /></>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { id: "profile", label: "Overview", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "experience", label: "Experience", icon: Calendar },
    { id: "blogs", label: "Journal", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-bg text-ink flex font-sans selection:bg-accent/20 overflow-hidden">
      {/* --- TOASTS --- */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
                toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                toast.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-500" :
                "bg-ink/[0.05] border-line text-ink"
              }`}
            >
              {toast.type === "success" && <CheckCircle2 size={18} />}
              {toast.type === "error" && <AlertCircle size={18} />}
              {toast.type === "info" && <Sparkles size={18} />}
              <span className="text-[13px] font-medium">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- SIDEBAR (DESKTOP/TABLET) --- */}
      <aside className="hidden md:flex w-[80px] lg:w-[260px] bg-bg border-r border-line flex-col fixed inset-y-0 z-50 transition-all duration-300">
        <div className="p-4 lg:p-6 pb-2 flex flex-col items-center lg:items-stretch">
          <div className="flex items-center gap-3 mb-8 lg:px-2 justify-center lg:justify-start">
            <div className="w-10 h-10 lg:w-8 lg:h-8 shrink-0 bg-ink rounded-xl lg:rounded-lg flex items-center justify-center text-bg font-black italic shadow-lg">
              M
            </div>
            <div className="hidden lg:block">
              <span className="font-bold text-[15px] block leading-none tracking-tight">Studio Admin</span>
              <span className="text-[10px] text-muted uppercase tracking-widest font-semibold mt-1 block">Production</span>
            </div>
          </div>

          <nav className="space-y-2 lg:space-y-1 w-full">
            <p className="hidden lg:block px-3 text-[10px] font-bold text-muted/50 uppercase tracking-widest mb-2 mt-4">Database</p>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  title={item.label}
                  className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-3 lg:py-2.5 rounded-xl text-[14px] font-medium transition-all group relative ${
                    isActive ? "text-ink bg-ink/[0.04]" : "text-muted hover:text-ink hover:bg-ink/[0.02]"
                  }`}
                >
                  {isActive && <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-5 bg-ink rounded-r-full hidden lg:block" />}
                  {isActive && <div className="absolute inset-0 border border-ink/10 rounded-xl lg:hidden" />}
                  <item.icon size={20} className={`lg:w-4 lg:h-4 shrink-0 ${isActive ? "text-ink" : "text-muted group-hover:text-ink transition-colors"}`} />
                  <span className="hidden lg:block">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 lg:p-6 border-t border-line/50 space-y-2 flex flex-col items-center lg:items-stretch">
          <button
            onClick={() => supabase.auth.signOut()}
            title="Sign Out"
            className="w-full flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-3 lg:py-2.5 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-xl text-[13px] font-medium transition-all group"
          >
            <LogOut size={20} className="lg:w-4 lg:h-4 shrink-0 group-hover:text-red-500 transition-colors" /> 
            <span className="hidden lg:block">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MOBILE FLOATING HEADER --- */}
      <div className="md:hidden fixed top-4 inset-x-4 z-40 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2.5 bg-bg/80 backdrop-blur-xl border border-line px-3.5 py-2 rounded-2xl shadow-xl pointer-events-auto">
          <div className="w-6 h-6 bg-ink rounded-md flex items-center justify-center text-bg font-black italic shadow-inner text-xs">M</div>
          <span className="font-bold text-[14px] tracking-tight">Admin</span>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="p-2.5 bg-bg/80 backdrop-blur-xl border border-line text-muted hover:text-red-500 rounded-2xl shadow-xl pointer-events-auto transition-colors">
          <LogOut size={16} />
        </button>
      </div>

      {/* --- MOBILE BOTTOM NAV --- */}
      <div className="md:hidden fixed bottom-6 inset-x-4 z-50 flex justify-center pointer-events-none">
        <nav className="flex items-center gap-1 bg-bg/90 backdrop-blur-2xl border border-line p-1.5 rounded-3xl shadow-2xl pointer-events-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`relative flex flex-col items-center justify-center w-[60px] h-[54px] rounded-2xl transition-all duration-300 ${
                  isActive ? "text-ink bg-ink/[0.04]" : "text-muted hover:text-ink"
                }`}
              >
                {isActive && <motion.div layoutId="mobile-active" className="absolute inset-0 border border-ink/10 rounded-2xl" />}
                <item.icon size={20} className={isActive ? "mb-1" : ""} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && <span className="text-[9px] font-bold tracking-wide">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 md:ml-[80px] lg:ml-[260px] h-screen overflow-y-auto pt-24 md:pt-0 pb-32 md:pb-0 transition-all duration-300">
        <div className="max-w-[1200px] mx-auto p-5 sm:p-8 md:p-12">
          
          <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-muted">
                <Database size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Connected to Supabase</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight capitalize text-ink">
                {activeTab === 'profile' ? 'System Overview' : activeTab}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-ink transition-colors" size={16} />
                <input
                  id="cms-search"
                  type="text"
                  placeholder="Search... (⌘K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-ink/[0.03] border border-line rounded-xl py-2.5 pl-10 pr-4 text-[14px] text-ink placeholder:text-muted/50 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all"
                />
              </div>
              
              <button
                onClick={() => fetchData()}
                disabled={loading}
                className="p-2.5 bg-ink/[0.03] border border-line hover:bg-ink/[0.06] text-ink rounded-xl transition-all disabled:opacity-50"
                title="Refresh Data"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>

              {activeTab !== "profile" && (
                <button
                  onClick={() => { setEditingItem({}); setIsDrawerOpen(true); }}
                  className="bg-ink text-bg px-4 py-2.5 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg whitespace-nowrap"
                >
                  <Plus size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">Create Entry</span>
                </button>
              )}
            </div>
          </header>

          <div className="pb-24">
            {activeTab === "profile" && <ProfileOverview profile={profile} setProfile={setProfile} onSave={() => handleUpsertItem("profile", profile)} loading={actionLoading} onMigrate={migrateStaticData} />}
            {activeTab === "projects" && <ProjectGrid items={projects} onEdit={(it: any) => { setEditingItem(it); setIsDrawerOpen(true); }} onDelete={(id: string) => handleDelete("projects", id)} />}
            {activeTab === "experience" && <ExperienceTimeline items={filteredExperiences} onEdit={(it: any) => { setEditingItem(it); setIsDrawerOpen(true); }} onDelete={(id: string) => handleDelete("experience", id)} />}
            {activeTab === "blogs" && <BlogTable items={filteredBlogs} onEdit={(it: any) => { setEditingItem(it); setIsDrawerOpen(true); }} onDelete={(id: string) => handleDelete("blogs", id)} />}
          </div>
        </div>
      </main>

      {/* --- EDITOR DRAWER --- */}
      <EditorDrawer
        isOpen={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); setEditingItem(null); }}
        item={editingItem}
        tab={activeTab}
        onSave={(data: any) => handleUpsertItem(activeTab, data)}
        loading={actionLoading}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════
   COMPONENTS 
   ══════════════════════════════════════════════ */

function ProfileOverview({ profile, setProfile, onSave, loading, onMigrate }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-6 bg-ink/[0.01] border border-line p-6 rounded-3xl">
          <div className="flex items-center gap-3 pb-4 border-b border-line/50">
            <UserIcon size={18} className="text-muted" />
            <h3 className="text-[15px] font-semibold">Public Identity</h3>
          </div>
          <Field label="Display Name" value={profile.name} onChange={(v: string) => setProfile((p: any) => ({ ...p, name: v }))} />
          <Field label="Professional Role" value={profile.role} onChange={(v: string) => setProfile((p: any) => ({ ...p, role: v }))} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Birth Year" value={profile.birthYear?.toString()} onChange={(v: string) => setProfile((p: any) => ({ ...p, birthYear: parseInt(v) || 0 }))} />
            <Field label="Location" value={profile.location} onChange={(v: string) => setProfile((p: any) => ({ ...p, location: v }))} />
          </div>
        </section>

        <section className="space-y-6 bg-ink/[0.01] border border-line p-6 rounded-3xl">
          <div className="flex items-center gap-3 pb-4 border-b border-line/50">
            <Globe size={18} className="text-muted" />
            <h3 className="text-[15px] font-semibold">Contact & Links</h3>
          </div>
          <Field label="Primary Email" value={profile.email} onChange={(v: string) => setProfile((p: any) => ({ ...p, email: v }))} />
          <Field label="Resume Document URL" value={profile.resumeUrl} onChange={(v: string) => setProfile((p: any) => ({ ...p, resumeUrl: v }))} />
        </section>
      </div>

      <section className="bg-ink/[0.01] border border-line p-6 rounded-3xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-line/50">
          <FileText size={18} className="text-muted" />
          <h3 className="text-[15px] font-semibold">Executive Summary</h3>
        </div>
        <Field label="Bio / Summary" value={profile.summary} onChange={(v: string) => setProfile((p: any) => ({ ...p, summary: v }))} area />
      </section>

      <section className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-3xl space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-amber-500/20">
          <Database size={18} className="text-amber-500" />
          <h3 className="text-[15px] font-semibold text-amber-500">Database Migration Engine</h3>
        </div>
        <p className="text-[13px] text-amber-500/80 leading-relaxed max-w-2xl">
          Your portfolio currently has hardcoded fallback data (Projects, Blogs, Experience). 
          Execute this migration to permanently inject all static data into your active Supabase database. 
          Once completed, you will be able to dynamically edit and delete all existing entries directly from this CMS.
        </p>
        <button
          onClick={onMigrate}
          disabled={loading}
          className="bg-amber-500 text-bg px-5 py-2.5 rounded-xl text-[14px] font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg disabled:opacity-50"
        >
          {loading ? "Executing Migration..." : "Migrate Static Data"}
        </button>
      </section>

      <div className="flex justify-end pt-4">
        <button
          onClick={onSave}
          disabled={loading}
          className="bg-ink text-bg px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-xl"
        >
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <Check size={18} strokeWidth={2.5} />}
          Save System Configuration
        </button>
      </div>
    </motion.div>
  );
}

function ProjectGrid({ items, onEdit, onDelete }: any) {
  if (!items.length) return <EmptyState tab="projects" />;
  return (
    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <AnimatePresence>
        {items.map((it: any) => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            key={it.id}
            className="group bg-bg border border-line hover:border-ink/20 rounded-3xl p-6 transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-ink/5"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-ink/[0.03] border border-line rounded-2xl flex items-center justify-center text-ink/40 group-hover:text-ink group-hover:bg-ink/[0.05] transition-all">
                <Code2 size={20} />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(it)} className="p-2 text-muted hover:text-ink hover:bg-ink/[0.05] rounded-lg transition-colors"><Edit2 size={14} /></button>
                <button onClick={() => onDelete(it.id)} className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
            
            <h4 className="font-bold text-lg mb-2 text-ink line-clamp-1">{it.title}</h4>
            <p className="text-[13px] text-muted line-clamp-2 leading-relaxed flex-1 mb-6">
              {Array.isArray(it.description) ? it.description[0] : it.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {it.tech?.slice(0, 3).map((t: string, i: number) => (
                <span key={i} className="px-2.5 py-1 bg-ink/[0.04] border border-line rounded-md text-[11px] font-mono text-muted/80">{t}</span>
              ))}
              {it.tech?.length > 3 && <span className="px-2.5 py-1 bg-transparent text-[11px] text-muted font-medium">+{it.tech.length - 3}</span>}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-line/50 mt-auto">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted/40">Order: {it.order_index}</span>
              <div className="flex gap-3">
                {it.link && <a href={it.link} target="_blank" rel="noreferrer" className="text-muted hover:text-ink transition-colors"><Globe size={16} /></a>}
                {it.demo_url && <a href={it.demo_url} target="_blank" rel="noreferrer" className="text-muted hover:text-ink transition-colors"><ExternalLink size={16} /></a>}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function ExperienceTimeline({ items, onEdit, onDelete }: any) {
  if (!items.length) return <EmptyState tab="experience" />;
  return (
    <div className="max-w-4xl relative">
      <div className="absolute left-[39px] top-4 bottom-4 w-px bg-line/50 hidden sm:block" />
      <div className="space-y-6">
        <AnimatePresence>
          {items.map((it: any) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={it.id}
              className="flex flex-col sm:flex-row gap-4 sm:gap-8 group"
            >
              <div className="sm:w-[80px] flex sm:flex-col items-center sm:items-end sm:pt-4 gap-3 shrink-0 z-10">
                <div className="w-5 h-5 rounded-full bg-bg border-2 border-line group-hover:border-ink/40 transition-colors shadow-sm hidden sm:block" />
                <span className="text-[11px] font-bold text-muted/60 uppercase tracking-widest sm:text-right">{it.period?.split('-')[0]?.trim() || "N/A"}</span>
              </div>
              
              <div className="flex-1 bg-ink/[0.01] hover:bg-ink/[0.02] border border-line rounded-3xl p-6 transition-all group-hover:border-ink/20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-lg text-ink">{it.role}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[13px] text-muted">
                      <Briefcase size={13} className="opacity-50" /> {it.company}
                      {it.location && <><span className="opacity-30">•</span> <MapPin size={13} className="opacity-50" /> {it.location}</>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(it)} className="p-2 text-muted hover:text-ink hover:bg-ink/[0.05] rounded-lg"><Edit2 size={14} /></button>
                    <button onClick={() => onDelete(it.id)} className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
                  </div>
                </div>
                <ul className="space-y-2 mt-4">
                  {(Array.isArray(it.highlights) ? it.highlights.slice(0, 2) : []).map((highlight: string, idx: number) => (
                    <li key={idx} className="text-[13.5px] text-muted/80 leading-relaxed flex items-start gap-2">
                      <span className="text-ink/20 mt-1.5 shrink-0 w-1 h-1 rounded-full bg-current" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                  {Array.isArray(it.highlights) && it.highlights.length > 2 && (
                    <li className="text-[12px] font-semibold text-accent pt-2">+{it.highlights.length - 2} more entries</li>
                  )}
                </ul>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function BlogTable({ items, onEdit, onDelete }: any) {
  if (!items.length) return <EmptyState tab="blogs" />;
  return (
    <div className="bg-bg border border-line rounded-3xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-line/50 bg-ink/[0.01]">
              <th className="px-6 py-4 text-[11px] font-bold text-muted uppercase tracking-widest w-[40%]">Article</th>
              <th className="px-6 py-4 text-[11px] font-bold text-muted uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold text-muted uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[11px] font-bold text-muted uppercase tracking-widest">Metrics</th>
              <th className="px-6 py-4 text-[11px] font-bold text-muted uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {items.map((it: any) => (
                <motion.tr
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={it.id}
                  className="border-b border-line/30 hover:bg-ink/[0.02] transition-colors group"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[14px] text-ink line-clamp-1">{it.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-mono text-muted/60 bg-ink/[0.04] px-1.5 py-0.5 rounded">/{it.slug}</span>
                      <span className="text-[11px] text-muted/60">{it.category || 'Uncategorized'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
                      it.published ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${it.published ? "bg-emerald-500" : "bg-amber-500"}`} />
                      {it.published ? "Live" : "Draft"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] text-muted whitespace-nowrap">{it.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-[12px] text-muted whitespace-nowrap">
                      <Clock size={12} className="opacity-50" /> {it.readTime || "2 min"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={`/blog/${it.slug}`} target="_blank" rel="noreferrer" className="p-2 text-muted hover:text-ink hover:bg-ink/[0.05] rounded-lg transition-colors"><ExternalLink size={14} /></a>
                      <button onClick={() => onEdit(it)} className="p-2 text-muted hover:text-ink hover:bg-ink/[0.05] rounded-lg transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => onDelete(it.id)} className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-line rounded-3xl bg-ink/[0.01]">
      <div className="w-16 h-16 bg-ink/[0.03] rounded-2xl flex items-center justify-center mb-4 text-muted/30">
        <LayoutDashboard size={24} />
      </div>
      <h3 className="text-[16px] font-bold text-ink mb-1">No {tab} found</h3>
      <p className="text-[13px] text-muted max-w-sm">
        Get started by creating your first entry. It will immediately be synchronized across your workspace.
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   EDITOR DRAWER 
   ══════════════════════════════════════════════ */

function EditorDrawer({ isOpen, onClose, item, tab, onSave, loading }: any) {
  const [formData, setFormData] = useState<any>({});
  const [subTab, setSubTab] = useState("basic");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        onSave(formData);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onSave, formData]);

  useEffect(() => {
    if (item && Object.keys(item).length > 0) {
      setFormData(item);
      setSubTab("basic");
      return;
    }

    if (tab === "projects") {
      setFormData({ title: "", description: [""], tech: [""], link: "", demo_url: "", order_index: 0 });
    } else if (tab === "experience") {
      setFormData({ role: "", company: "", location: "", period: "", highlights: [""], order_index: 0 });
    } else if (tab === "blogs") {
      setFormData({
        title: "", slug: "", excerpt: "", content: "", category: "", published: true,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase(),
      });
    } else {
      setFormData(item || {});
    }
    setSubTab("basic");
  }, [item, tab]);

  const handleTitleChange = (title: string) => {
    if (tab === "blogs") {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      setFormData({ ...formData, title, slug: formData.slug || slug });
    } else {
      setFormData({ ...formData, title });
    }
  };

  if (!isOpen) return null;

  const isEdit = item && Object.keys(item).length > 0;
  const entityName = tab.slice(0, tab.endsWith('s') ? -1 : tab.length);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        {/* Sliding Panel */}
        <motion.div
          initial={window.innerWidth < 768 ? { y: "100%", opacity: 0.5 } : { x: "100%", opacity: 0.5 }}
          animate={window.innerWidth < 768 ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
          exit={window.innerWidth < 768 ? { y: "100%", opacity: 0 } : { x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
          className="relative w-full md:max-w-[640px] h-[90vh] md:h-full mt-auto md:mt-0 bg-bg md:border-l border-t md:border-t-0 border-line shadow-2xl flex flex-col will-change-transform rounded-t-3xl md:rounded-t-none"
        >
          {/* Mobile Handle */}
          <div className="md:hidden flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-line rounded-full" />
          </div>

          {/* Header */}
          <header className="px-5 md:px-8 py-4 md:py-6 border-b border-line flex items-center justify-between bg-bg/80 backdrop-blur-md z-10 sticky top-0">
            <div>
              <div className="flex items-center gap-2 text-muted/60 mb-1">
                <Database size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{tab} table</span>
              </div>
              <h3 className="text-xl font-bold text-ink capitalize tracking-tight">
                {isEdit ? "Edit" : "Create"} {entityName}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted/40 uppercase tracking-widest hidden sm:inline-block border border-line px-2 py-1 rounded">⌘ S to save</span>
              <button onClick={onClose} className="p-2.5 bg-ink/[0.04] hover:bg-ink/10 text-ink rounded-full transition-colors">
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>
          </header>

          {/* Sub Navigation */}
          {tab !== "profile" && (
            <div className="px-8 py-3 border-b border-line flex gap-6 text-[13px] font-semibold bg-ink/[0.01]">
              {(tab === "blogs" ? ["basic", "content", "seo"] : 
                tab === "projects" ? ["basic", "details"] : 
                ["basic", "highlights"]).map((t) => (
                <button
                  key={t}
                  onClick={() => setSubTab(t)}
                  className={`capitalize pb-3 -mb-[13px] border-b-2 transition-colors ${
                    subTab === t ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
            <div className="space-y-8 pb-10">
              
              {tab === "projects" && subTab === "basic" && (
                <>
                  <Field label="Project Title" value={formData.title} onChange={handleTitleChange} />
                  <div className="grid grid-cols-2 gap-6">
                    <Field label="Tech Stack (comma sep)" value={Array.isArray(formData.tech) ? formData.tech.join(", ") : ""} onChange={(v: string) => setFormData({ ...formData, tech: v.split(",").map((s) => s.trim()) })} />
                    <Field label="Display Priority" value={formData.order_index?.toString() || "0"} onChange={(v: string) => setFormData({ ...formData, order_index: parseInt(v, 10) || 0 })} />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <Field label="Live URL" value={formData.demo_url} onChange={(v: string) => setFormData({ ...formData, demo_url: v })} />
                    <Field label="Repository" value={formData.link} onChange={(v: string) => setFormData({ ...formData, link: v })} />
                  </div>
                </>
              )}
              {tab === "projects" && subTab === "details" && (
                <Field label="Key Features & Highlights (New line for bullets)" value={Array.isArray(formData.description) ? formData.description.join("\n") : formData.description || ""} onChange={(v: string) => setFormData({ ...formData, description: v.split("\n") })} area />
              )}

              {tab === "experience" && subTab === "basic" && (
                <>
                  <Field label="Role Title" value={formData.role} onChange={(v: string) => setFormData({ ...formData, role: v })} />
                  <Field label="Company Name" value={formData.company} onChange={(v: string) => setFormData({ ...formData, company: v })} />
                  <div className="grid grid-cols-2 gap-6">
                    <Field label="Location" value={formData.location} onChange={(v: string) => setFormData({ ...formData, location: v })} />
                    <Field label="Duration" value={formData.period} onChange={(v: string) => setFormData({ ...formData, period: v })} />
                  </div>
                  <Field label="Display Priority" value={formData.order_index?.toString() || "0"} onChange={(v: string) => setFormData({ ...formData, order_index: parseInt(v, 10) || 0 })} />
                </>
              )}
              {tab === "experience" && subTab === "highlights" && (
                <Field label="Responsibilities & Impact (New line for bullets)" value={Array.isArray(formData.highlights) ? formData.highlights.join("\n") : formData.highlights || ""} onChange={(v: string) => setFormData({ ...formData, highlights: v.split("\n") })} area />
              )}

              {tab === "blogs" && subTab === "basic" && (
                <>
                  <Field label="Article Title" value={formData.title} onChange={handleTitleChange} />
                  <Field label="URL Slug" value={formData.slug} onChange={(v: string) => setFormData({ ...formData, slug: v })} />
                  <Field label="Category" value={formData.category} onChange={(v: string) => setFormData({ ...formData, category: v })} />
                  <div className="grid grid-cols-2 gap-6">
                    <Field label="Publish Date" value={formData.date} onChange={(v: string) => setFormData({ ...formData, date: v })} />
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-muted uppercase tracking-[0.15em] ml-1">
                        Calculated Read Time
                      </label>
                      <div className="w-full bg-ink/[0.04] border border-line rounded-xl p-3.5 text-[14px] text-ink/50 font-mono shadow-inner flex items-center gap-2">
                        <Clock size={14} />
                        {calculateReadTime(formData.content, formData.excerpt)}
                      </div>
                    </div>
                  </div>
                </>
              )}
              {tab === "blogs" && subTab === "content" && (
                <div className="flex flex-col h-full min-h-[400px]">
                  <Field label="Markdown Content" value={formData.content} onChange={(v: string) => setFormData({ ...formData, content: v })} area fullHeight />
                </div>
              )}
              {tab === "blogs" && subTab === "seo" && (
                <>
                  <div className="p-5 bg-ink/[0.02] border border-line rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="text-[14px] font-bold text-ink mb-1">Publication State</h4>
                      <p className="text-[12px] text-muted">Toggle visibility on the public site.</p>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, published: !formData.published })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.published ? 'bg-emerald-500' : 'bg-line'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.published ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <Field label="Excerpt / Meta Description" value={formData.excerpt} onChange={(v: string) => setFormData({ ...formData, excerpt: v })} area />
                </>
              )}

            </div>
          </div>

          {/* Footer */}
          <footer className="px-8 py-6 border-t border-line bg-bg/80 backdrop-blur-md z-10 sticky bottom-0 flex justify-end gap-4">
            <button onClick={onClose} className="px-6 py-3 rounded-xl text-[14px] font-bold text-muted hover:text-ink hover:bg-ink/[0.05] transition-colors">
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              disabled={loading}
              className="bg-ink text-bg px-8 py-3 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-xl"
            >
              {loading ? <RefreshCw className="animate-spin" size={16} /> : <Check size={16} strokeWidth={2.5} />}
              Commit Entry
            </button>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function Field({ label, value, onChange, area, placeholder, fullHeight }: any) {
  return (
    <div className={`space-y-2 ${fullHeight ? 'flex-1 flex flex-col' : ''}`}>
      <label className="block text-[11px] font-bold text-muted uppercase tracking-[0.15em] ml-1">
        {label}
      </label>
      {area ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-ink/[0.02] border border-line rounded-2xl p-4 text-[14px] text-ink placeholder:text-muted/30 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 resize-none leading-relaxed transition-all shadow-inner ${fullHeight ? 'flex-1' : 'min-h-[160px]'}`}
        />
      ) : (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-ink/[0.02] border border-line rounded-xl p-3.5 text-[14px] text-ink placeholder:text-muted/30 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all shadow-inner"
        />
      )}
    </div>
  );
}
