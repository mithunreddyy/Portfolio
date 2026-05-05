import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BLOG_POSTS } from '../constants';
import { BlogPost } from '../types';
import { Plus, Trash2, Edit3, Save, X, ExternalLink, LogIn, LogOut, ShieldAlert } from 'lucide-react';
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

export function CMS() {
  const [user, setUser] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newBlog, setNewBlog] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Web Development',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
    readTime: '5 min read'
  });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    const q = query(collection(db, 'blogs'), orderBy('date', 'desc'));
    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
      setBlogs(docs.length > 0 ? docs : BLOG_POSTS);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'blogs');
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);

  const isAdmin = user?.email === ADMIN_EMAIL && user?.emailVerified;

  const handleAdd = async () => {
    if (!newBlog.title || !newBlog.slug || !isAdmin) return;
    const id = Math.random().toString(36).substring(7);
    const blogToAdd: BlogPost = {
      ...newBlog as BlogPost,
      id,
    };
    
    try {
      await setDoc(doc(db, 'blogs', id), blogToAdd);
      setIsAdding(false);
      resetForm();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `blogs/${id}`);
    }
  };

  const resetForm = () => {
    setNewBlog({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Web Development',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
      readTime: '5 min read'
    });
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, 'blogs', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `blogs/${id}`);
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingId(blog.id);
    setNewBlog(blog);
    setIsAdding(true);
  };

  const handleUpdate = async () => {
    if (!newBlog.id || !isAdmin) return;
    try {
      await updateDoc(doc(db, 'blogs', newBlog.id), newBlog as any);
      setIsAdding(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `blogs/${newBlog.id}`);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-bg flex items-center justify-center">
      <motion.div 
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="w-12 h-12 bg-accent/20 rounded-full blur-xl" 
      />
    </div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg text-ink flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Admin CMS</h1>
            <p className="text-muted/60">This area is reserved for the portfolio owner. Please sign in to continue.</p>
          </div>
          <button 
            onClick={() => login()}
            className="w-full px-8 py-4 bg-accent text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-3 uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <LogIn size={18} /> Sign in with Google
          </button>
          <Link to="/" className="block text-[10px] font-bold text-muted/40 uppercase tracking-[0.4em] hover:text-ink transition-colors">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-bg text-ink flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="p-4 bg-red-500/10 rounded-full text-red-500">
              <ShieldAlert size={48} />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Access Denied</h1>
            <p className="text-muted/60">You do not have permission to access this CMS. Logged in as: <span className="text-ink font-mono text-xs">{user.email}</span></p>
          </div>
          <button 
            onClick={() => logout()}
            className="w-full px-8 py-4 bg-bg rounded-2xl font-bold text-xs flex items-center justify-center gap-3 uppercase tracking-[0.2em] hover:bg-ink hover:text-bg transition-all font-mono shadow-md"
          >
            <LogOut size={18} /> Sign Out
          </button>
          <Link to="/" className="block text-[10px] font-bold text-muted/40 uppercase tracking-[0.4em] hover:text-ink transition-colors">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-ink p-8 md:p-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
            <Link to="/" className="text-[10px] font-bold text-accent uppercase tracking-[0.4em] mb-2 flex items-center gap-2 hover:translate-x-1 transition-transform">
              ← Back to Portfolio
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Blog CMS</h1>
          </div>
          
          <button 
            onClick={() => { setIsAdding(true); setEditingId(null); }}
            className="px-8 py-4 bg-ink text-bg rounded-2xl font-bold text-xs flex items-center justify-center gap-3 uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
          >
            <Plus size={18} /> New Entry
          </button>
        </div>

        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 p-8 bg-bg rounded-[2rem] shadow-2xl relative"
          >
            <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-6 right-6 p-2 text-muted/40 hover:text-ink"
            >
                <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold mb-8">{editingId ? 'Edit Post' : 'Create New Post'}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted/40 uppercase tracking-widest">Title</label>
                <input 
                  type="text" 
                  value={newBlog.title}
                  onChange={e => setNewBlog({...newBlog, title: e.target.value})}
                  className="w-full bg-ink/[0.05] rounded-xl p-4 text-ink outline-none focus:bg-ink/[0.08] transition-colors"
                  placeholder="e.g. Scaling Architectures"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted/40 uppercase tracking-widest">Slug</label>
                <input 
                  type="text" 
                  value={newBlog.slug}
                  onChange={e => setNewBlog({...newBlog, slug: e.target.value})}
                  className="w-full bg-ink/[0.05] rounded-xl p-4 text-ink outline-none focus:bg-ink/[0.08] transition-colors"
                  placeholder="scaling-architectures"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-muted/40 uppercase tracking-widest">Excerpt</label>
                <textarea 
                  value={newBlog.excerpt}
                  onChange={e => setNewBlog({...newBlog, excerpt: e.target.value})}
                  className="w-full bg-ink/[0.05] rounded-xl p-4 text-ink outline-none focus:bg-ink/[0.08] transition-colors h-24 resize-none"
                  placeholder="A short summary..."
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-muted/40 uppercase tracking-widest">Full Content</label>
                <textarea 
                  value={newBlog.content}
                  onChange={e => setNewBlog({...newBlog, content: e.target.value})}
                  className="w-full bg-ink/[0.05] rounded-xl p-4 text-ink outline-none focus:bg-ink/[0.08] transition-colors h-48 resize-none"
                  placeholder="The main story..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted/40 uppercase tracking-widest">Category</label>
                <input 
                  type="text" 
                  value={newBlog.category}
                  onChange={e => setNewBlog({...newBlog, category: e.target.value})}
                  className="w-full bg-ink/[0.05] rounded-xl p-4 text-ink outline-none focus:bg-ink/[0.08] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted/40 uppercase tracking-widest">Read Time</label>
                <input 
                  type="text" 
                  value={newBlog.readTime}
                  onChange={e => setNewBlog({...newBlog, readTime: e.target.value})}
                  className="w-full bg-ink/[0.05] rounded-xl p-4 text-ink outline-none focus:bg-ink/[0.08] transition-colors"
                />
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button 
                onClick={editingId ? handleUpdate : handleAdd}
                className="px-10 py-4 bg-accent text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-3 uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
              >
                <Save size={18} /> {editingId ? 'Update Post' : 'Publish Post'}
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="group p-8 bg-ink/[0.03] rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all hover:bg-ink/[0.06]">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{blog.category}</span>
                  <span className="text-[10px] text-muted/40 font-bold uppercase tracking-widest">{blog.date}</span>
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">{blog.title}</h3>
                <p className="text-sm text-muted/60 font-mono italic">/{blog.slug}</p>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleEdit(blog)}
                  className="p-4 bg-bg rounded-2xl text-muted hover:text-ink hover:bg-ink/5 transition-all shadow-sm"
                  title="Edit"
                >
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(blog.id)}
                  className="p-4 bg-bg rounded-2xl text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all shadow-sm"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
                <a 
                  href={`/blog/${blog.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-bg rounded-2xl text-accent hover:text-ink hover:bg-ink/5 transition-all shadow-sm"
                  title="View"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
