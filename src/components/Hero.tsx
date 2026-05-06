import { Copy, CopyCheck, Eye, FileDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { usePortfolioData } from '../hooks/usePortfolioData';

import { PersonalInfo } from '../types';

export function Hero({ personalInfo }: { personalInfo: PersonalInfo }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const viewResume = () => {
    window.open(personalInfo.resumeUrl, '_blank');
  };

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = personalInfo.resumeUrl;
    link.download = 'Mithun_Reddy_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) return;
      
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      if (key === 'm') {
        copyEmail();
      } else if (key === 'v') {
        viewResume();
      } else if (key === 'd') {
        downloadResume();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [personalInfo.email, personalInfo.resumeUrl]);

  return (
    <section id="hero" className="section-container pt-6 sm:pt-8 pb-8 sm:pb-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="space-y-5 sm:space-y-6"
      >
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl sm:text-[20px] font-semibold text-ink tracking-tight">{personalInfo.name}</h1>
              <img src="/verified-badge.png" alt="Verified" className="w-4 h-4 sm:w-[18px] sm:h-[18px] object-contain shrink-0" />
            </div>

            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent/5 border border-accent/10">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-accent uppercase tracking-wider">Available for work</span>
            </div>
          </div>

          {/* Role subtitle */}
          <div className="flex items-center gap-2 text-[16px] sm:text-[18px] text-muted/80 font-regular">
            <span>{personalInfo.role}</span>
            <span className="text-muted/20 text-[12px] sm:text-[14px]">/</span>
            <span className="text-muted/60">{personalInfo.location}</span>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="text-[16px] sm:text-[18px] leading-[1.6] text-muted/75 font-regular">
            Hey, I'm <span className="text-ink font-semibold">{(personalInfo.name || '').split(' ')[0]}</span> {(personalInfo.summary || '').includes('🇮🇳') 
              ? (personalInfo.summary || '').split('🇮🇳')[0] 
              : (personalInfo.summary || '')}
            {(personalInfo.summary || '').includes('🇮🇳') && (
              <img src="/indian-flag.png" alt="India" className="inline-block w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] mx-0.5 -translate-y-[2px]" />
            )}
            {(personalInfo.summary || '').includes('🇮🇳') && (personalInfo.summary || '').split('🇮🇳')[1]}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10 pt-2">
          {/* Copy Email CTA */}
          <div className="relative">
            <button
              onClick={copyEmail}
              className="hidden sm:flex items-center gap-2 text-[14px] sm:text-[15px] font-medium text-muted/60 transition-colors hover:text-ink group"
            >
              <span>Press</span>
              <span className="flex items-center justify-center w-[22px] h-[22px] rounded-md bg-ink/[0.08] text-ink text-[11px] font-bold shadow-sm group-hover:bg-ink/[0.15] transition-colors uppercase">M</span>
              <span>to copy email</span>
            </button>

            <button
              onClick={copyEmail}
              className="flex sm:hidden items-center gap-2 text-[13px] font-medium text-muted/50 active:text-ink transition-colors py-1"
            >
              <Copy size={13} className="text-muted/40" />
              <span>Tap to copy email</span>
            </button>

            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 -bottom-6 flex items-center gap-2 text-accent"
                >
                  <CopyCheck size={10} />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Email copied!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Resume CTAs (Desktop Combined) */}
          <div className="hidden sm:flex items-center gap-2.5 text-[14px] sm:text-[15px] font-medium text-muted/60">
            <span>Press</span>
            <button onClick={viewResume} className="flex items-center gap-2 hover:text-ink transition-colors group">
              <span className="flex items-center justify-center w-[22px] h-[22px] rounded-md bg-ink/[0.08] text-ink text-[11px] font-bold shadow-sm group-hover:bg-ink/[0.15] transition-colors uppercase">V</span>
              <span>to view</span>
            </button>
            <span className="text-muted/60">&</span>
            <button onClick={downloadResume} className="flex items-center gap-2 hover:text-ink transition-colors group">
              <span className="flex items-center justify-center w-[22px] h-[22px] rounded-md bg-ink/[0.08] text-ink text-[11px] font-bold shadow-sm group-hover:bg-ink/[0.15] transition-colors uppercase">D</span>
              <span>to download</span>
            </button>
            <span>resume</span>
          </div>

          {/* Resume CTAs (Mobile Separate) */}
          <div className="flex sm:hidden items-center gap-6">
            <button
              onClick={viewResume}
              className="flex items-center gap-2 text-[13px] font-medium text-muted/50 active:text-ink transition-colors py-1"
            >
              <Eye size={13} className="text-muted/40" />
              <span>View resume</span>
            </button>

            <button
              onClick={downloadResume}
              className="flex items-center gap-2 text-[13px] font-medium text-muted/50 active:text-ink transition-colors py-1"
            >
              <FileDown size={13} className="text-muted/40" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
