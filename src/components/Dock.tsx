import { Briefcase, Code, Layout, Mail, Moon, PenTool, Sun, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const dockItems = [
  { id: 'hero', icon: <User size={15} strokeWidth={1.5} />, label: 'Profile' },
  { id: 'projects', icon: <Layout size={15} strokeWidth={1.5} />, label: 'Projects' },
  { id: 'experience', icon: <Briefcase size={15} strokeWidth={1.5} />, label: 'Experience' },
  { id: 'skills', icon: <Code size={15} strokeWidth={1.5} />, label: 'Stack' },
  { id: 'blog', icon: <PenTool size={15} strokeWidth={1.5} />, label: 'Blog' },
  { id: 'contact', icon: <Mail size={15} strokeWidth={1.5} />, label: 'Contact' },
];

export function Dock() {
  const [activeSection, setActiveSection] = useState('hero');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = dockItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      sections.forEach((section) => {
        if (!section) return;
        if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
          setActiveSection(section.id);
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 28, stiffness: 380, delay: 0.4 }}
      className="fixed bottom-5 sm:bottom-6 left-0 right-0 z-[100] flex justify-center px-4 dock-safe-area"
      aria-label="Navigation dock"
    >
      <div className="flex items-center gap-0 h-10 px-1 bg-bg/80 rounded-full backdrop-blur-xl border border-ink/[0.08]">
        {dockItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            aria-label={item.label}
            className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 group ${activeSection === item.id ? 'text-ink' : 'text-muted/35 hover:text-muted/70'}`}
          >
            {item.icon}
            {/* Tooltip */}
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-ink text-bg rounded-md text-[9px] font-semibold tracking-wide opacity-0 group-hover:md:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {item.label}
            </div>
            {activeSection === item.id && (
              <motion.div
                layoutId="dock-dot"
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-ink rounded-full"
                transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
              />
            )}
          </button>
        ))}
        {/* Theme toggle — same size, no separator */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 text-muted/35 hover:text-muted/70"
        >
          {theme === 'dark' ? <Sun size={15} strokeWidth={1.6} /> : <Moon size={15} strokeWidth={1.6} />}
        </button>
      </div>
    </motion.nav>
  );
}
