import { Code, FileText, Mail, MessageSquare, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { soundEngine } from '../lib/SoundEngine';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => {
          if (!open) soundEngine.playClick();
          return !open;
        });
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleCustomEvent = () => {
      soundEngine.playClick();
      setIsOpen(true);
    };

    document.addEventListener('keydown', down);
    window.addEventListener('open-command-palette', handleCustomEvent);
    return () => {
      document.removeEventListener('keydown', down);
      window.removeEventListener('open-command-palette', handleCustomEvent);
    };
  }, []);

  const commands = [
    { id: 'projects', name: 'View Projects', icon: <Code size={16} />, action: () => { window.location.hash = 'projects'; setIsOpen(false); } },
    { id: 'contact', name: 'Contact Me', icon: <Mail size={16} />, action: () => { window.location.hash = 'contact'; setIsOpen(false); } },
    { id: 'resume', name: 'Download Resume', icon: <FileText size={16} />, action: () => { window.open('/mithunresume.pdf', '_blank'); setIsOpen(false); } },
    { id: 'blog', name: 'View Blog', icon: <MessageSquare size={16} />, action: () => { window.location.hash = 'blog'; setIsOpen(false); } },
  ];

  const filteredCommands = commands.filter((cmd) => cmd.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[20vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-bg/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full max-w-lg bg-bg/80 backdrop-blur-2xl border border-ink/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            <div className="flex items-center px-4 py-3 border-b border-ink/5">
              <Search size={18} className="text-muted/50 mr-3" />
              <input
                type="text"
                autoFocus
                placeholder="Type a command or search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-ink text-[15px] placeholder:text-muted/30 font-medium"
              />
              <div className="text-[10px] font-mono tracking-widest uppercase text-muted/30 px-2 py-1 bg-ink/5 rounded-md">ESC</div>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="p-4 text-center text-[13px] text-muted/50 font-medium">No results found.</div>
              ) : (
                filteredCommands.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    className="w-full flex items-center px-3 py-3 gap-3 text-left hover:bg-ink/[0.04] rounded-xl transition-colors group"
                  >
                    <div className="text-muted/50 group-hover:text-ink transition-colors">{cmd.icon}</div>
                    <span className="text-[14px] font-medium text-ink/80 group-hover:text-ink transition-colors">{cmd.name}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
