import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PERSONAL_INFO } from '../constants';

export function Header() {
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
      <div className="section-container h-12 sm:h-14 flex justify-between items-center text-[11px] sm:text-[12px] font-mono font-medium text-muted/50">
        <div>EST. {PERSONAL_INFO.birthYear}</div>
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-muted/30" />
          <span className="text-ink/70">{timeString}</span>
        </div>
      </div>
    </header>
  );
}
