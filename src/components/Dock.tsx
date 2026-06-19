import { AppWindow, Briefcase, Layers, Mail, MessageSquare, Moon, Sun, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { getLenis } from './SmoothScroll';

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
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    dockItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(el, { offset: -20, duration: 1.0 });
    } else {
      // Fallback for mobile (no Lenis)
      const top = el.getBoundingClientRect().top + window.scrollY - 20;
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
      <div className="flex items-center gap-2 sm:gap-2 lg:gap-2 h-[40px] sm:h-[44px] lg:h-[48px] px-2 sm:px-2 lg:px-3 bg-bg/50 backdrop-blur-lg rounded-[16px] sm:rounded-[18px] lg:rounded-[17px] border border-ink/[0.1] shadow-xl">
        {dockItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={`${item.id}-${index}`}
              onClick={() => {
                scrollToSection(item.id);
              }}
              aria-label={item.label}
              className={`relative flex items-center justify-center w-[25px] h-[25px] sm:w-[30px] sm:h-[30px] lg:w-[35px] lg:h-[35px] rounded-[10px] sm:rounded-[12px] transition-all duration-200 group ${
                activeSection === item.id 
                  ? 'text-ink' 
                  : 'text-ink/60 hover:text-ink hover:bg-ink/5'
              }`}
            >
              <Icon className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] lg:w-[18px] lg:h-[18px]" strokeWidth={1.25} />
              
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeDockDot"
                  className="absolute -bottom-[1px] sm:-bottom-[2px] lg:-bottom-[2px] w-[3px] h-[3px] sm:w-[3.5px] sm:h-[3.5px] lg:w-[4px] lg:h-[4px] rounded-full bg-ink/40"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-ink text-bg rounded-[8px] text-[10px] sm:text-[11px] font-medium tracking-wide opacity-0 group-hover:md:opacity-100 transition-all scale-90 group-hover:scale-100 pointer-events-none whitespace-nowrap shadow-2xl z-[110]">
                {item.label}
              </div>
            </button>
          );
        })}

        <div className="w-[1px] h-4 sm:h-5 bg-ink/5 mx-1 sm:mx-2 lg:mx-2" />

        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="relative flex items-center justify-center w-[25px] h-[25px] sm:w-[30px] sm:h-[30px] lg:w-[35px] lg:h-[35px] rounded-[10px] sm:rounded-[12px] transition-all duration-200 text-ink/60 hover:text-ink hover:bg-ink/5 group"
        >
          {theme === 'dark' 
            ? <Sun className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] lg:w-[18px] lg:h-[18px]" strokeWidth={1.25} /> 
            : <Moon className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] lg:w-[18px] lg:h-[18px]" strokeWidth={1.25} />}
            
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-ink text-bg rounded-[8px] text-[10px] sm:text-[11px] font-medium tracking-wide opacity-0 group-hover:md:opacity-100 transition-all scale-90 group-hover:scale-100 pointer-events-none whitespace-nowrap shadow-2xl z-[110]">
            Theme
          </div>
        </button>
      </div>
    </motion.nav>
  );
}