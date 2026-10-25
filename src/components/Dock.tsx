import { AppWindow, Briefcase, Layers, Mail, MessageSquare, Moon, Sun, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { toggleTheme, useTheme } from '../hooks/useTheme';
import { scrollToSection } from '../lib/utils';

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
  const { theme } = useTheme();

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
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

  return (
    <motion.nav
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 28, stiffness: 380, delay: 0.4 }}
      className="fixed bottom-4 sm:bottom-6 lg:bottom-8 left-0 right-0 z-[100] flex justify-center px-4 dock-safe-area"
      aria-label="Navigation dock"
    >
      <div className="flex items-center p-1 bg-bg/70 backdrop-blur-lg rounded-2xl border border-ink/10">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'true' : undefined}
              className={`relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-10 rounded-xl transition-colors duration-200 group ${
                isActive ? 'text-ink' : 'text-muted hover:text-ink'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeDockItem"
                  className="absolute inset-0 rounded-xl bg-ink/[0.08]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="relative w-[18px] h-[18px]" strokeWidth={1.5} aria-hidden="true" />

              <span className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-ink text-bg rounded-lg text-[11px] font-medium opacity-0 group-hover:md:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[110]">
                {item.label}
              </span>
            </button>
          );
        })}

        <div className="w-px h-5 bg-ink/15 mx-1" aria-hidden="true" />

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-10 rounded-xl transition-colors duration-200 text-muted hover:text-ink group"
        >
          {theme === 'dark'
            ? <Sun className="w-[18px] h-[18px]" strokeWidth={1.5} aria-hidden="true" />
            : <Moon className="w-[18px] h-[18px]" strokeWidth={1.5} aria-hidden="true" />}

          <span className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-ink text-bg rounded-lg text-[11px] font-medium opacity-0 group-hover:md:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[110]">
            Theme
          </span>
        </button>
      </div>
    </motion.nav>
  );
}