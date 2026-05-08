import {
  AlertCircle,
  Check,
  Database,
  Edit3,
  ExternalLink,
  FileText,
  History,
  Layout,
  LayoutDashboard,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Sparkles,
  Terminal,
  Trash2,
  User as UserIcon,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useState } from "react";
import { PERSONAL_INFO } from "../constants";
import { supabase } from "../lib/supabase";
import { BlogPost, Experience, PersonalInfo, Project } from "../types";

const ADMIN_EMAIL = "mithunreddy1357@gmail.com";

type Tab = "profile" | "projects" | "experience" | "blogs";

export function CMS() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const [profile, setProfile] = useState<PersonalInfo>(PERSONAL_INFO);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

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

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
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
            readTime: blog.read_time || blog.readTime || "",
          })),
        );
      }

      setError(null);
      setSyncMessage("Sync complete.");
      setTimeout(() => setSyncMessage(null), 2500);
    } catch (err: any) {
      if (err.code !== "PGRST116") {
        console.warn("Supabase Sync:", err.message);
      }
      setError(err.message || "Unable to fetch CMS data.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email !== ADMIN_EMAIL) {
      setError("Unauthorized access.");
      return;
    }
    setAuthLoading(true);
    setError(null);
    try {
      const siteUrl =
        import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") ||
        window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: siteUrl + "/cms" },
      });
      if (error) {
        console.error("Supabase auth error:", error);
        throw error;
      }
      setMagicLinkSent(true);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.message ||
          "Authentication failed. Please check your connection and try again.",
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleUpsertItem = async (table: string, data: any) => {
    setActionLoading(true);
    setError(null);

    if (table === "projects" && !data.title) {
      setError("Project title is required.");
      setActionLoading(false);
      return;
    }

    if (table === "experience" && (!data.role || !data.company)) {
      setError("Experience role and company are required.");
      setActionLoading(false);
      return;
    }

    if (table === "blogs" && (!data.title || !data.slug)) {
      setError("Blog title and slug are required.");
      setActionLoading(false);
      return;
    }

    try {
      // --- STRICT SCHEMA SANITIZATION ---
      const payload: any = {};

      // Only include common base fields if they exist
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
        payload.read_time = data.readTime || data.read_time || "";
      }

      payload.updated_at = new Date().toISOString();

      const { error } = await supabase.from(table).upsert(payload);

      if (error) throw error;

      setSuccess(
        `${table.charAt(0).toUpperCase() + table.slice(1)} synchronized.`,
      );
      setIsModalOpen(false);
      setEditingItem(null);
      fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    setActionLoading(true);
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      setSuccess("Record removed.");
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin" />
        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">
          Initializing Core
        </span>
      </div>
    );

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 selection:bg-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#0A0A0A] border border-white/[0.08] rounded-[32px] p-10 shadow-2xl"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-white/[0.03] border border-white/[0.08] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Terminal className="text-white/60" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-muted/40 text-sm">
              Secure access via magic link
            </p>
          </div>

          {magicLinkSent ? (
            <div className="text-center py-6 bg-white/[0.02] border border-white/[0.08] rounded-2xl">
              <Sparkles className="mx-auto mb-4 text-white" size={32} />
              <p className="text-white font-bold">Link Sent</p>
              <p className="text-muted/40 text-[12px] px-6 mt-2">
                Check your email to authenticate your session.
              </p>
              <button
                onClick={() => setMagicLinkSent(false)}
                className="mt-8 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] hover:text-white transition-colors"
              >
                Back to login
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mithunreddy.dev"
                  className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-white/20 transition-all"
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
                  {error}
                </p>
              )}
              <button
                disabled={authLoading}
                className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 active:scale-[0.98] transition-all"
              >
                {authLoading ? (
                  <RefreshCw className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
                Authorize Session
              </button>
            </form>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans selection:bg-white/10">
      <aside className="w-72 bg-[#080808] border-r border-white/[0.06] flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-black italic shadow-2xl shadow-white/10">
              M
            </div>
            <div>
              <span className="font-bold text-lg block leading-none">
                Admin
              </span>
              <span className="text-[10px] text-muted/40 uppercase tracking-[0.2em] font-bold">
                Workspace v3.2
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: "profile", label: "Identity", icon: UserIcon },
              { id: "projects", label: "Work", icon: LayoutDashboard },
              { id: "experience", label: "Experience", icon: History },
              { id: "blogs", label: "Journal", icon: FileText },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-[13px] font-medium transition-all group ${activeTab === item.id ? "bg-white text-black shadow-xl shadow-white/5" : "text-muted/40 hover:text-white hover:bg-white/[0.02]"}`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/[0.04] space-y-4">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="w-full flex items-center justify-center gap-2 text-white/40 hover:text-white text-[11px] font-bold transition-colors py-2 uppercase tracking-widest"
          >
            <Database size={14} /> {showDebug ? "Hide" : "Show"} Debug
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center justify-center gap-2 text-red-500/40 hover:text-red-500 text-[11px] font-bold transition-colors py-2 uppercase tracking-widest"
          >
            <LogOut size={14} /> Exit Console
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-72 p-16">
        <header className="flex items-end justify-between mb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/20">
              <Database size={12} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Supabase Cloud
              </span>
            </div>
            <h2 className="text-4xl font-bold tracking-tighter capitalize">
              {activeTab}
            </h2>
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                size={16}
              />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-sm w-64 focus:outline-none focus:border-white/20 transition-all"
              />
            </div>
            {activeTab !== "profile" && (
              <button
                onClick={() => {
                  setEditingItem({});
                  setIsModalOpen(true);
                }}
                className="bg-white text-black px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Plus size={18} /> Add New
              </button>
            )}
            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-white/10 text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/15 transition-all disabled:opacity-40"
            >
              <RefreshCw size={18} /> Refresh
            </button>
          </div>
        </header>

        <div className="max-w-5xl">
          <AnimatePresence mode="wait">
            {success && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="mb-10 p-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[13px] flex items-center gap-3"
              >
                <Check size={18} className="text-green-500" /> {success}
              </motion.div>
            )}
            {syncMessage && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="mb-10 p-4 bg-accent/10 border border-accent/20 text-accent rounded-2xl text-[13px] flex items-center gap-3"
              >
                <RefreshCw size={18} className="text-accent" /> {syncMessage}
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="mb-10 p-4 bg-red-500/5 border border-red-500/10 text-red-400 rounded-2xl text-[13px] flex items-center gap-3"
              >
                <AlertCircle size={18} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <ProfileTab
                profile={profile}
                setProfile={setProfile}
                onSave={() => handleUpsertItem("profile", profile)}
                loading={actionLoading}
              />
            )}
            {activeTab === "projects" && (
              <DataList
                items={projects.filter((p) =>
                  p.title.toLowerCase().includes(searchQuery.toLowerCase()),
                )}
                onEdit={(it: any) => {
                  setEditingItem(it);
                  setIsModalOpen(true);
                }}
                onDelete={(id: string) => handleDelete("projects", id)}
              />
            )}
            {activeTab === "experience" && (
              <DataList
                items={experiences.filter((e) =>
                  e.role.toLowerCase().includes(searchQuery.toLowerCase()),
                )}
                onEdit={(it: any) => {
                  setEditingItem(it);
                  setIsModalOpen(true);
                }}
                onDelete={(id: string) => handleDelete("experience", id)}
              />
            )}
            {activeTab === "blogs" && (
              <BlogList
                items={blogs.filter((b) =>
                  b.title.toLowerCase().includes(searchQuery.toLowerCase()),
                )}
                onEdit={(it: any) => {
                  setEditingItem(it);
                  setIsModalOpen(true);
                }}
                onDelete={(id: string) => handleDelete("blogs", id)}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      <EditorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
        tab={activeTab}
        onSave={(data: any) => handleUpsertItem(activeTab, data)}
        loading={actionLoading}
      />

      <DebugPanel
        isOpen={showDebug}
        profile={profile}
        projects={projects}
        experiences={experiences}
        blogs={blogs}
        onRefetch={fetchData}
        loading={loading}
      />
    </div>
  );
}

function ProfileTab({ profile, setProfile, onSave, loading }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 bg-white/[0.02] border border-white/[0.06] p-10 rounded-[32px]"
    >
      <div className="grid grid-cols-2 gap-10">
        <div className="space-y-8">
          <Field
            label="Full Name"
            value={profile.name}
            onChange={(v: string) =>
              setProfile((p: any) => ({ ...p, name: v }))
            }
          />
          <Field
            label="Role"
            value={profile.role}
            onChange={(v: string) =>
              setProfile((p: any) => ({ ...p, role: v }))
            }
          />
          <Field
            label="Birth Year"
            value={profile.birthYear?.toString()}
            onChange={(v: string) =>
              setProfile((p: any) => ({ ...p, birthYear: parseInt(v) || 0 }))
            }
          />
        </div>
        <div className="space-y-8">
          <Field
            label="Email"
            value={profile.email}
            onChange={(v: string) =>
              setProfile((p: any) => ({ ...p, email: v }))
            }
          />
          <Field
            label="Location"
            value={profile.location}
            onChange={(v: string) =>
              setProfile((p: any) => ({ ...p, location: v }))
            }
          />
          <Field
            label="Resume Link"
            value={profile.resumeUrl}
            onChange={(v: string) =>
              setProfile((p: any) => ({ ...p, resumeUrl: v }))
            }
          />
        </div>
      </div>
      <Field
        label="Summary"
        value={profile.summary}
        onChange={(v: string) => setProfile((p: any) => ({ ...p, summary: v }))}
        area
      />
      <div className="flex justify-end pt-4">
        <button
          onClick={onSave}
          disabled={loading}
          className="bg-white text-black px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {loading ? (
            <RefreshCw className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          Synchronize Profile
        </button>
      </div>
    </motion.div>
  );
}

function DataList({ items, onEdit, onDelete }: any) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((it: any) => (
        <div
          key={it.id}
          className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-3xl flex flex-col gap-4 hover:border-white/20 transition-all group"
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-5 min-w-0">
              <div className="w-12 h-12 bg-white/[0.04] rounded-2xl flex items-center justify-center text-white/20 font-bold text-lg">
                <Layout size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-lg text-white truncate">
                  {it.title || it.role}
                </h4>
                <p className="text-[11px] text-muted/40 uppercase tracking-[0.18em] font-semibold">
                  {it.company || it.period || "Project Entry"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(it.link || it.demo_url) && (
                <a
                  href={it.demo_url || it.link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-white/[0.04] rounded-xl text-[11px] font-semibold text-white hover:bg-white transition-all"
                >
                  {it.demo_url ? "Live Demo" : "Link"}
                </a>
              )}
              {typeof it.order_index !== "undefined" && (
                <span className="px-3 py-2 bg-ink/5 rounded-xl text-[11px] font-semibold uppercase tracking-[0.18em] text-muted/40">
                  Order {it.order_index}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-muted/50 leading-relaxed line-clamp-2">
            {Array.isArray(it.description)
              ? it.description[0]
              : it.description || "No details provided."}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => onEdit(it)}
              className="p-3 bg-white/[0.04] hover:bg-white text-white hover:text-black rounded-xl transition-all"
            >
              <Edit3 size={18} />
            </button>
            <button
              onClick={() => onDelete(it.id)}
              className="p-3 bg-red-500/5 hover:bg-red-500 text-red-500/40 hover:text-white rounded-xl transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function BlogList({ items, onEdit, onDelete, onTogglePublished }: any) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((it: any) => (
        <div
          key={it.id}
          className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-3xl flex flex-col gap-4 hover:border-white/20 transition-all group"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${it.published ? "bg-emerald-500/10 text-emerald-300" : "bg-amber-500/10 text-amber-300"}`}
                >
                  {it.published ? "Published" : "Draft"}
                </span>
                <span className="text-[10px] text-muted/40 uppercase tracking-[0.14em] font-semibold">
                  {it.date} • {it.category || "Uncategorized"}
                </span>
              </div>
              <h4 className="font-bold text-lg text-white mb-1 truncate">
                {it.title}
              </h4>
              <p className="text-sm text-muted/40 leading-relaxed line-clamp-2">
                {it.excerpt || "No excerpt provided."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onTogglePublished(it)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold ${it.published ? "bg-amber-500 text-black" : "bg-emerald-500 text-black"}`}
              >
                {it.published ? "Set Draft" : "Publish"}
              </button>
              <a
                href={`/blog/${it.slug}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white/[0.04] hover:bg-white text-white hover:text-black rounded-xl transition-all"
              >
                <ExternalLink size={18} />
              </a>
              <button
                onClick={() => onEdit(it)}
                className="p-3 bg-white/[0.04] hover:bg-white text-white hover:text-black rounded-xl transition-all"
              >
                <Edit3 size={18} />
              </button>
              <button
                onClick={() => onDelete(it.id)}
                className="p-3 bg-red-500/5 hover:bg-red-500 text-red-500/40 hover:text-white rounded-xl transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Field({ label, value, onChange, area, placeholder }: any) {
  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
        {label}
      </label>
      {area ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-white/20 min-h-[160px] resize-none leading-relaxed transition-all"
        />
      ) : (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl p-5 text-sm text-white focus:outline-none focus:border-white/20 transition-all"
        />
      )}
    </div>
  );
}

function EditorModal({ isOpen, onClose, item, tab, onSave, loading }: any) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (item && Object.keys(item).length > 0) {
      setFormData(item);
      return;
    }

    if (tab === "projects") {
      setFormData({
        title: "",
        description: [""],
        tech: [""],
        link: "",
        demo_url: "",
        order_index: 0,
      });
      return;
    }

    if (tab === "experience") {
      setFormData({
        role: "",
        company: "",
        location: "",
        period: "",
        highlights: [""],
        order_index: 0,
      });
      return;
    }

    if (tab === "blogs") {
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "",
        published: true,
        date: new Date()
          .toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          .toUpperCase(),
      });
      return;
    }

    setFormData(item || {});
  }, [item, tab]);

  const handleTitleChange = (title: string) => {
    if (tab === "blogs") {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData({ ...formData, title, slug: formData.slug || slug });
    } else {
      setFormData({ ...formData, title });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-12 bg-black/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-[#0A0A0A] border border-white/[0.08] rounded-[40px] p-12 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <h3 className="text-2xl font-bold mb-12 flex items-center gap-3">
          <Sparkles className="text-white/20" size={24} />
          Editor: {tab.slice(0, -1)}
        </h3>

        <div className="grid grid-cols-2 gap-12 max-h-[60vh] overflow-y-auto pr-8 scrollbar-hide">
          <div className="space-y-8">
            {tab === "projects" && (
              <>
                <Field
                  label="Project Name"
                  value={formData.title}
                  onChange={handleTitleChange}
                />
                <Field
                  label="Tech Stack"
                  value={
                    Array.isArray(formData.tech) ? formData.tech.join(", ") : ""
                  }
                  onChange={(v: string) =>
                    setFormData({
                      ...formData,
                      tech: v.split(",").map((s) => s.trim()),
                    })
                  }
                />
                <Field
                  label="Live URL"
                  value={formData.demo_url}
                  onChange={(v: string) =>
                    setFormData({ ...formData, demo_url: v })
                  }
                />
                <Field
                  label="Repository / Link"
                  value={formData.link}
                  onChange={(v: string) =>
                    setFormData({ ...formData, link: v })
                  }
                />
                <Field
                  label="Display Order"
                  value={formData.order_index?.toString() || "0"}
                  onChange={(v: string) =>
                    setFormData({
                      ...formData,
                      order_index: parseInt(v, 10) || 0,
                    })
                  }
                />
              </>
            )}
            {tab === "experience" && (
              <>
                <Field
                  label="Role"
                  value={formData.role}
                  onChange={(v: string) =>
                    setFormData({ ...formData, role: v })
                  }
                />
                <Field
                  label="Company"
                  value={formData.company}
                  onChange={(v: string) =>
                    setFormData({ ...formData, company: v })
                  }
                />
                <Field
                  label="Location"
                  value={formData.location}
                  onChange={(v: string) =>
                    setFormData({ ...formData, location: v })
                  }
                />
                <Field
                  label="Period"
                  value={formData.period}
                  onChange={(v: string) =>
                    setFormData({ ...formData, period: v })
                  }
                />
                <Field
                  label="Display Order"
                  value={formData.order_index?.toString() || "0"}
                  onChange={(v: string) =>
                    setFormData({
                      ...formData,
                      order_index: parseInt(v, 10) || 0,
                    })
                  }
                />
              </>
            )}
            {tab === "blogs" && (
              <>
                <Field
                  label="Title"
                  value={formData.title}
                  onChange={handleTitleChange}
                />
                <Field
                  label="Slug"
                  value={formData.slug}
                  onChange={(v: string) =>
                    setFormData({ ...formData, slug: v })
                  }
                />
                <Field
                  label="Category"
                  value={formData.category}
                  onChange={(v: string) =>
                    setFormData({ ...formData, category: v })
                  }
                />
                <Field
                  label="Publish Date"
                  value={formData.date}
                  onChange={(v: string) =>
                    setFormData({ ...formData, date: v })
                  }
                />
                <Field
                  label="Estimated Read Time"
                  value={formData.readTime || ""}
                  onChange={(v: string) =>
                    setFormData({ ...formData, readTime: v })
                  }
                />
                <button
                  onClick={() =>
                    setFormData({ ...formData, published: !formData.published })
                  }
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold ${formData.published ? "bg-emerald-500 text-black" : "bg-amber-500 text-black"}`}
                >
                  {formData.published ? "Published" : "Draft"}
                </button>
              </>
            )}
          </div>
          <div className="space-y-8">
            {tab === "projects" && (
              <Field
                label="Highlights"
                value={
                  Array.isArray(formData.description)
                    ? formData.description.join("\n")
                    : formData.description || ""
                }
                onChange={(v: string) =>
                  setFormData({ ...formData, description: v.split("\n") })
                }
                area
              />
            )}
            {tab === "experience" && (
              <Field
                label="Highlights"
                value={
                  Array.isArray(formData.highlights)
                    ? formData.highlights.join("\n")
                    : formData.highlights || ""
                }
                onChange={(v: string) =>
                  setFormData({ ...formData, highlights: v.split("\n") })
                }
                area
              />
            )}
            {tab === "blogs" && (
              <>
                <Field
                  label="Excerpt"
                  value={formData.excerpt}
                  onChange={(v: string) =>
                    setFormData({ ...formData, excerpt: v })
                  }
                  area
                />
                <Field
                  label="Content"
                  value={formData.content}
                  onChange={(v: string) =>
                    setFormData({ ...formData, content: v })
                  }
                  area
                />
              </>
            )}
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-white/5 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
          >
            Dismiss
          </button>
          <button
            onClick={() => onSave(formData)}
            disabled={loading}
            className="flex-1 bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl"
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Commit Entry
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DebugPanel({
  isOpen,
  profile,
  projects,
  experiences,
  blogs,
  onRefetch,
  loading,
}: any) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateSchema = () => {
    const checks = {
      profile_complete: !!(profile.name && profile.role && profile.email),
      projects_valid: projects.every(
        (p: any) => p.title && Array.isArray(p.tech),
      ),
      experiences_valid: experiences.every((e: any) => e.role && e.company),
      blogs_valid: blogs.every((b: any) => b.title && b.slug),
      published_blogs_count: blogs.filter((b: any) => b.published !== false)
        .length,
      draft_blogs_count: blogs.filter((b: any) => b.published === false).length,
    };
    return checks;
  };

  const validation = validateSchema();

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      className="fixed right-0 top-0 bottom-0 w-[420px] bg-[#0A0A0A] border-l border-white/[0.08] shadow-2xl flex flex-col z-40"
    >
      <div className="p-6 border-b border-white/[0.04] flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Database size={16} /> Debug Panel
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* CMS State Summary */}
        <div className="p-6 space-y-4 border-b border-white/[0.04]">
          <h4 className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
            CMS State
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-3">
              <p className="text-[10px] text-white/40">Projects</p>
              <p className="text-xl font-bold text-white">{projects.length}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-3">
              <p className="text-[10px] text-white/40">Experience</p>
              <p className="text-xl font-bold text-white">
                {experiences.length}
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-3">
              <p className="text-[10px] text-white/40">Total Blogs</p>
              <p className="text-xl font-bold text-white">{blogs.length}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-3">
              <p className="text-[10px] text-white/40">Published</p>
              <p className="text-xl font-bold text-emerald-400">
                {validation.published_blogs_count}
              </p>
            </div>
          </div>
        </div>

        {/* Validation Checks */}
        <div className="p-6 space-y-3 border-b border-white/[0.04]">
          <h4 className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
            Schema Validation
          </h4>
          {Object.entries(validation).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-white/[0.01] rounded-lg border border-white/[0.04]"
            >
              <span className="text-[11px] font-medium text-white/60">
                {key}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded ${
                  typeof value === "boolean"
                    ? value
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                    : "bg-blue-500/10 text-blue-400"
                }`}
              >
                {typeof value === "boolean" ? (value ? "✓" : "✗") : value}
              </span>
            </div>
          ))}
        </div>

        {/* Project Details */}
        <div className="p-6 space-y-3 border-b border-white/[0.04]">
          <button
            onClick={() =>
              setExpandedSection(
                expandedSection === "projects" ? null : "projects",
              )
            }
            className="w-full flex items-center justify-between p-3 bg-white/[0.02] rounded-lg hover:bg-white/[0.04] transition-all"
          >
            <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">
              Projects ({projects.length})
            </span>
            <span className="text-white/40">
              {expandedSection === "projects" ? "▼" : "▶"}
            </span>
          </button>
          {expandedSection === "projects" && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {projects.map((p: any, i: number) => (
                <div
                  key={i}
                  className="p-2 bg-white/[0.01] rounded border border-white/[0.04] text-[10px]"
                >
                  <p className="font-semibold text-white">{p.title}</p>
                  <p className="text-white/40">
                    Tech: {(p.tech || []).join(", ")}
                  </p>
                  <p className="text-white/40">
                    Order: {p.order_index || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Blog Details */}
        <div className="p-6 space-y-3 border-b border-white/[0.04]">
          <button
            onClick={() =>
              setExpandedSection(expandedSection === "blogs" ? null : "blogs")
            }
            className="w-full flex items-center justify-between p-3 bg-white/[0.02] rounded-lg hover:bg-white/[0.04] transition-all"
          >
            <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">
              Blogs ({blogs.length})
            </span>
            <span className="text-white/40">
              {expandedSection === "blogs" ? "▼" : "▶"}
            </span>
          </button>
          {expandedSection === "blogs" && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {blogs.map((b: any, i: number) => (
                <div
                  key={i}
                  className="p-2 bg-white/[0.01] rounded border border-white/[0.04] text-[10px]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-white">{b.title}</p>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        b.published
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {b.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-white/40">Slug: {b.slug}</p>
                  <p className="text-white/40">Date: {b.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Raw JSON Export */}
        <div className="p-6 space-y-3">
          <button
            onClick={() =>
              setExpandedSection(expandedSection === "json" ? null : "json")
            }
            className="w-full flex items-center justify-between p-3 bg-white/[0.02] rounded-lg hover:bg-white/[0.04] transition-all"
          >
            <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">
              Raw JSON Export
            </span>
            <span className="text-white/40">
              {expandedSection === "json" ? "▼" : "▶"}
            </span>
          </button>
          {expandedSection === "json" && (
            <pre className="p-3 bg-black/40 border border-white/[0.04] rounded text-[8px] overflow-x-auto text-white/60 max-h-48 overflow-y-auto">
              {JSON.stringify(
                { profile, projects, experiences, blogs },
                null,
                2,
              ).substring(0, 1000)}
              ...
            </pre>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/[0.04] space-y-2">
        <button
          onClick={onRefetch}
          disabled={loading}
          className="w-full bg-white/[0.05] hover:bg-white/10 text-white text-[11px] font-bold py-2 rounded-lg transition-all disabled:opacity-40"
        >
          {loading ? "Syncing..." : "Sync Now"}
        </button>
        <button
          onClick={() => {
            const data = { profile, projects, experiences, blogs };
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
          }}
          className="w-full bg-white/[0.05] hover:bg-white/10 text-white text-[11px] font-bold py-2 rounded-lg transition-all"
        >
          Copy JSON
        </button>
      </div>
    </motion.div>
  );
}
