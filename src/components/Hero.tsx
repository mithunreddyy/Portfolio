import { Check, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { PersonalInfo } from '../types';

const FLAG = '🇮🇳';

const inlineLink =
  'font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink transition-colors';

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] as const },
});

export function Hero({ personalInfo }: { personalInfo: PersonalInfo }) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
    } catch {
      // Clipboard blocked: leave the label unchanged rather than claim a copy
      return;
    }
    setCopied(true);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopied(false), 2000);
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
      if (key === 'm') copyEmail();
      else if (key === 'v') viewResume();
      else if (key === 'd') downloadResume();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [personalInfo.email, personalInfo.resumeUrl]);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const firstName = (personalInfo.name || '').split(' ')[0];
  const [beforeFlag, afterFlag] = (personalInfo.summary || '').split(FLAG);
  const hasFlag = (personalInfo.summary || '').includes(FLAG);

  return (
    <section id="hero" className="section-container pt-4 sm:pt-6 pb-4 sm:pb-6">
      <motion.div {...reveal(0)}>
        <h1 className="text-[18px] sm:text-[20px] font-medium text-ink leading-snug">{personalInfo.name}</h1>
        <p className="mt-2 text-[16px] sm:text-[18px] text-muted leading-snug">{personalInfo.role}</p>
      </motion.div>

      <motion.div {...reveal(0.1)} className="mt-3.5 sm:mt-4 flex flex-col gap-3.5 sm:gap-4 text-[16px] sm:text-[18px] leading-[1.6] text-muted max-w-xl">
        <p>
          Hey, I'm <span className="text-ink font-semibold">{firstName}</span>{' '}
          {hasFlag ? beforeFlag : personalInfo.summary}
          {hasFlag && (
            <>
              <img
                src={`${import.meta.env.BASE_URL}indian-flag.png`}
                alt="India"
                className="inline-block w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] mx-0.5 -translate-y-[2px]"
                decoding="async"
                loading="lazy"
              />
              {afterFlag}
            </>
          )}
        </p>

        <p>
          Find me on{' '}
          <a href={`https://github.com/${personalInfo.github}`} target="_blank" rel="noreferrer" className={inlineLink}>
            GitHub
          </a>{' '}
          and{' '}
          <a href={`https://linkedin.com/in/${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className={inlineLink}>
            LinkedIn
          </a>
          , or email me at{' '}
          <button
            type="button"
            onClick={copyEmail}
            aria-label={`Copy email address ${personalInfo.email}`}
            className="group inline-flex items-center gap-1.5 align-bottom text-ink font-medium"
          >
            <span className="flex flex-col h-[1.6em] overflow-hidden">
              <span
                className={`whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(.65,0,0,1)] motion-reduce:transition-none group-hover:-translate-y-full group-focus-visible:-translate-y-full ${
                  copied ? '-translate-y-[200%]' : ''
                }`}
              >
                {personalInfo.email}
              </span>
              <span
                aria-hidden="true"
                className={`whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(.65,0,0,1)] motion-reduce:transition-none group-hover:-translate-y-full group-focus-visible:-translate-y-full ${
                  copied ? '-translate-y-[200%]' : ''
                }`}
              >
                Click to copy
              </span>
              <span
                aria-hidden="true"
                className={`whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(.65,0,0,1)] motion-reduce:transition-none group-hover:-translate-y-full group-focus-visible:-translate-y-full ${
                  copied ? '-translate-y-[200%]' : ''
                }`}
              >
                Copied to clipboard
              </span>
            </span>
            {copied ? (
              <Check size={14} className="text-accent shrink-0" aria-hidden="true" />
            ) : (
              <Copy size={14} className="text-muted shrink-0" aria-hidden="true" />
            )}
            <span role="status" className="sr-only">
              {copied ? 'Email copied to clipboard' : ''}
            </span>
          </button>
          .
        </p>

        <p>
          My resume is a PDF:{' '}
          <button type="button" onClick={viewResume} className={inlineLink}>
            view it
          </button>{' '}
          or{' '}
          <button type="button" onClick={downloadResume} className={inlineLink}>
            download it
          </button>
          .
        </p>

        <p className="hidden sm:flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] sm:text-[15px] font-medium text-muted">
          <span>Shortcuts:</span>
          {[
            ['M', 'copy email'],
            ['V', 'view resume'],
            ['D', 'download resume'],
          ].map(([key, label]) => (
            <span key={key} className="inline-flex items-center gap-1.5 mr-2">
              <kbd className="flex items-center justify-center w-[22px] h-[22px] rounded-md bg-ink/[0.08] text-ink text-[11px] font-bold font-sans">
                {key}
              </kbd>
              {label}
            </span>
          ))}
        </p>
      </motion.div>
    </section>
  );
}
