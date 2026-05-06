import { AppWindow, Briefcase, Layers, Mail, MessageSquare, Moon, Sun, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const dockItems = [
  { id: 'hero', icon: User, label: 'Profile' },
  { id: 'projects', icon: AppWindow, label: 'Work' },
  { id: 'experience', icon: Briefcase, label: 'Experience' },
  { id: 'skills', icon: Layers, label: 'Stack' },
   { id: 'blog', icon: MessageSquare, label: 'Blog' },
  { id: 'contact', icon: Mail, label: 'Contact' },
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
      className="fixed bottom-4 sm:bottom-6 lg:bottom-8 left-0 right-0 z-[100] flex justify-center px-4 dock-safe-area"
      aria-label="Navigation dock"
    >
      <div className="flex items-center gap-[2px] sm:gap-1 h-[40px] sm:h-[44px] lg:h-[48px] px-1.5 sm:px-2 bg-[#111111] rounded-[16px] sm:rounded-[18px] border border-white/[0.08] shadow-2xl">
        {dockItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={`${item.id}-${index}`}
              onClick={() => scrollToSection(item.id)}
              aria-label={item.label}
              className={`relative flex items-center justify-center w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] lg:w-[40px] lg:h-[40px] rounded-[10px] sm:rounded-[12px] transition-all duration-200 group ${
                activeSection === item.id 
                  ? 'text-white bg-white/[0.04]' 
                  : 'text-[#888888] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] lg:w-[18px] lg:h-[18px]" strokeWidth={1.25} />
              
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#111111] border border-white/[0.08] text-white rounded-[8px] text-[10px] sm:text-[11px] font-medium tracking-wide opacity-0 group-hover:md:opacity-100 transition-all scale-90 group-hover:scale-100 pointer-events-none whitespace-nowrap shadow-2xl z-[110]">
                {item.label}
              </div>
            </button>
          );
        })}

        <div className="w-[1px] h-4 sm:h-5 bg-white/[0.08] mx-0.5 sm:mx-1" />

        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="relative flex items-center justify-center w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] lg:w-[40px] lg:h-[40px] rounded-[10px] sm:rounded-[12px] transition-all duration-200 text-[#888888] hover:text-white hover:bg-white/[0.04] group"
        >
          {theme === 'dark' 
            ? <Sun className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] lg:w-[18px] lg:h-[18px]" strokeWidth={1.25} /> 
            : <Moon className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] lg:w-[18px] lg:h-[18px]" strokeWidth={1.25} />}
            
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#111111] border border-white/[0.08] text-white rounded-[8px] text-[10px] sm:text-[11px] font-medium tracking-wide opacity-0 group-hover:md:opacity-100 transition-all scale-90 group-hover:scale-100 pointer-events-none whitespace-nowrap shadow-2xl z-[110]">
            Theme
          </div>
        </button>
      </div>
    </motion.nav>
  );
}