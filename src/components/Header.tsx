import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PersonalInfo } from '../types';

export function Header({ personalInfo }: { personalInfo?: PersonalInfo }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <header id="header" className="w-full bg-bg">
      <div className="section-container h-12 sm:h-14 flex justify-between items-center text-[12px] sm:text-[14px] font-mono font-medium text-muted/60">
        <div>EST. {personalInfo?.birthYear || '----'}</div>
        
        {/* Command Palette Visual Hint */}
        <div 
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink/[0.03] border border-ink/[0.05] cursor-pointer hover:bg-ink/[0.06] transition-colors"
          onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
        >
          <span className="text-[11px] font-sans text-muted/60">Search</span>
          <div className="flex gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-bg border border-ink/10 shadow-sm text-[10px] font-sans font-bold text-ink/70 flex items-center justify-center min-w-[20px]">⌘</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 rounded bg-bg border border-ink/10 shadow-sm text-[10px] font-sans font-bold text-ink/70 flex items-center justify-center min-w-[20px]">K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock size={16} className="text-muted/70" />
          <span className="text-ink/70">{timeString}</span>
          <span className="text-muted/70">GMT+5:30</span>
        </div>
      </div>
    </header>
  );
}
