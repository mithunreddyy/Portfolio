import { Code, FileText, Mail, MessageSquare, Moon, Search, Sun, User, Briefcase, Layers, Copy, CopyCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { KeyboardEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, toggleTheme } from '../hooks/useTheme';
import { BlogPost, PersonalInfo } from '../types';
import { scrollToSection } from '../lib/utils';

interface PaletteCommand {
  id: string;
  name: string;
  icon: ReactNode;
  run: () => void;
  // Commands that keep the palette open (e.g. copy feedback)
  keepOpen?: boolean;
}

export function CommandPalette({ personalInfo, blogs }: { personalInfo: PersonalInfo; blogs: BlogPost[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [emailCopied, setEmailCopied] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // Reset state and remember the trigger when opening; restore focus when closing
  const openPalette = useCallback(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setSearch('');
    setActiveIndex(0);
    setEmailCopied(false);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    returnFocusRef.current?.focus?.();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) close();
        else openPalette();
      } else if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('open-command-palette', openPalette);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('open-command-palette', openPalette);
    };
  }, [isOpen, close, openPalette]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setEmailCopied(true);
    } catch {
      // Clipboard blocked: the label stays as it was, so nothing false is claimed
    }
  };

  const commands = useMemo<PaletteCommand[]>(() => [
    { id: 'profile', name: 'Go to Profile', icon: <User size={16} />, run: () => scrollToSection('hero') },
    { id: 'projects', name: 'View Projects', icon: <Code size={16} />, run: () => scrollToSection('projects') },
    { id: 'experience', name: 'View Experience', icon: <Briefcase size={16} />, run: () => scrollToSection('experience') },
    { id: 'stack', name: 'View Stack', icon: <Layers size={16} />, run: () => scrollToSection('skills') },
    { id: 'blog', name: 'View Writing', icon: <MessageSquare size={16} />, run: () => scrollToSection('blog') },
    { id: 'contact', name: 'Contact Me', icon: <Mail size={16} />, run: () => scrollToSection('contact') },
    {
      id: 'theme',
      name: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
      icon: theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />,
      run: toggleTheme,
    },
    {
      id: 'email',
      name: emailCopied ? 'Email copied' : 'Copy email address',
      icon: emailCopied ? <CopyCheck size={16} /> : <Copy size={16} />,
      run: copyEmail,
      keepOpen: true,
    },
    {
      id: 'resume',
      name: 'Download Resume',
      icon: <FileText size={16} />,
      run: () => {
        const link = document.createElement('a');
        link.href = personalInfo.resumeUrl;
        link.download = 'Mithun_Reddy_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    },
    ...blogs.map((post): PaletteCommand => ({
      id: `post-${post.slug}`,
      name: `Read: ${post.title.replace(/\n/g, ' ')}`,
      icon: <MessageSquare size={16} />,
      run: () => navigate(`/blog/${post.slug}`),
    })),
  ], [theme, emailCopied, blogs, personalInfo.email, personalInfo.resumeUrl, navigate]);

  const filtered = commands.filter((cmd) => cmd.name.toLowerCase().includes(search.trim().toLowerCase()));
  const currentIndex = Math.min(activeIndex, Math.max(filtered.length - 1, 0));
  const activeCommand = filtered[currentIndex];

  // Keep the highlighted option visible while arrowing through a long list
  useEffect(() => {
    if (!activeCommand) return;
    document.getElementById(`cmd-${activeCommand.id}`)?.scrollIntoView({ block: 'nearest' });
  }, [activeCommand]);

  const runCommand = (cmd: PaletteCommand) => {
    cmd.run();
    if (!cmd.keepOpen) close();
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(filtered.length ? (currentIndex + 1) % filtered.length : 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(filtered.length ? (currentIndex - 1 + filtered.length) % filtered.length : 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeCommand) runCommand(activeCommand);
    } else if (e.key === 'Tab') {
      // Focus stays inside the dialog while it is open
      e.preventDefault();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[20vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-bg/50 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full max-w-lg bg-bg/80 backdrop-blur-2xl border border-ink/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            <div className="flex items-center px-4 py-3 border-b border-ink/5">
              <Search size={18} className="text-muted/50 mr-3" aria-hidden="true" />
              <input
                type="text"
                autoFocus
                role="combobox"
                aria-expanded="true"
                aria-controls="command-listbox"
                aria-autocomplete="list"
                aria-activedescendant={activeCommand ? `cmd-${activeCommand.id}` : undefined}
                aria-label="Type a command or search"
                placeholder="Type a command or search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onInputKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-ink text-[15px] placeholder:text-muted/40 font-medium"
              />
              <div className="text-[10px] font-mono tracking-widest uppercase text-muted px-2 py-1 bg-ink/5 rounded-md" aria-hidden="true">ESC</div>
            </div>
            <div id="command-listbox" role="listbox" aria-label="Commands" className="max-h-[300px] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div role="status" className="p-4 text-center text-[13px] text-muted font-medium">No results found.</div>
              ) : (
                filtered.map((cmd, i) => {
                  const isActive = i === currentIndex;
                  return (
                    <button
                      key={cmd.id}
                      id={`cmd-${cmd.id}`}
                      role="option"
                      aria-selected={isActive}
                      tabIndex={-1}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => runCommand(cmd)}
                      className={`w-full flex items-center px-3 py-3 gap-3 text-left rounded-xl transition-colors group ${isActive ? 'bg-ink/[0.04]' : ''}`}
                    >
                      <div className={`transition-colors ${isActive ? 'text-ink' : 'text-muted'}`}>{cmd.icon}</div>
                      <span className={`text-[14px] font-medium transition-colors ${isActive ? 'text-ink' : 'text-ink/80'}`}>{cmd.name}</span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
