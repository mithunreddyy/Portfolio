import { Copy, CopyCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { PERSONAL_INFO } from '../constants';

export function Hero() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm' && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        copyEmail();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <section id="hero" className="section-container pt-6 sm:pt-8 pb-8 sm:pb-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="space-y-5 sm:space-y-6"
      >
        <div className="space-y-0">
          <div className="flex items-center gap-1">
            <h1 className="text-2xl sm:text-[20px] font-medium text-ink tracking-tight">{PERSONAL_INFO.name}</h1>
            <img src="/verified-badge.png" alt="Verified" className="w-4 h-4 sm:w-[18px] sm:h-[18px] object-contain shrink-0" />
          </div>

          {/* Role subtitle */}
          <p className="text-[16px] sm:text-[18px] text-muted/70 font-regular">
            Full-Stack Software Engineer
          </p>

          {/* Location chip — like Core reference */}
          {/* <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-muted/40 font-medium">
            <MapPin size={12} className="text-muted/30" />
            <span>{PERSONAL_INFO.location}</span>
          </div> */}
        </div>

        <div className="max-w-xl">
          <p className="text-[16px] sm:text-[18px] leading-[1.6] text-muted/75 font-regular">
            Hey, I'm <span className="text-ink font-semibold">{PERSONAL_INFO.name.split(' ')[0]}</span>. {PERSONAL_INFO.summary}
          </p>
        </div>

        {/* Copy Email CTA */}
        <div className="relative">
          <button
            onClick={copyEmail}
            className="hidden sm:flex items-center gap-2.5 text-[16px] sm:text-[18px] font-medium text-muted/60 transition-colors hover:text-ink group"
          >
            <span>Press</span>
            <span className="flex items-center justify-center w-[24px] h-[24px] rounded-md bg-ink/[0.08] text-ink text-[12px] font-bold shadow-sm group-hover:bg-ink/[0.15] transition-colors">M</span>
            <span>to copy my email</span>
          </button>

          <button
            onClick={copyEmail}
            className="flex sm:hidden items-center gap-2 text-[14px] font-medium text-muted/50 active:text-ink transition-colors py-1.5"
          >
            <Copy size={14} className="text-muted/40" />
            <span>Tap to copy my email</span>
          </button>

          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute left-0 -bottom-7 flex items-center gap-2 text-accent"
              >
                <CopyCheck size={12} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Email copied!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
