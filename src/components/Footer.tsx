import { useState, FormEvent } from 'react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { Mail, Github, Linkedin, Twitter, ArrowUpRight, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Footer() {
  const { personalInfo } = usePortfolioData();
  const currentYear = new Date().getFullYear();
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!formState.name.trim()) { setStatus('error'); setErrorMessage('Please enter your name.'); return; }
    if (!validateEmail(formState.email)) { setStatus('error'); setErrorMessage('Please enter a valid email address.'); return; }
    if (!formState.message.trim()) { setStatus('error'); setErrorMessage('Please enter a message.'); return; }
    setStatus('success');
    setFormState({ name: '', email: '', message: '' });
    setTimeout(() => setStatus('idle'), 3000);
  };

  const socials = [
    { label: 'Email', value: personalInfo.email, icon: <Mail size={16} />, href: `mailto:${personalInfo.email}` },
    { label: 'GitHub', value: `@${personalInfo.github}`, icon: <Github size={16} />, href: `https://github.com/${personalInfo.github}` },
    { label: 'LinkedIn', value: `/in/${personalInfo.linkedin}`, icon: <Linkedin size={16} />, href: `https://linkedin.com/in/${personalInfo.linkedin}` }
  ];

  return (
    <footer id="contact" className="section-container pt-6 sm:pt-8 pb-24 sm:pb-20 bg-bg text-muted">
      <h2 className="text-[15px] sm:text-[17px] font-semibold text-ink mb-2">Contact</h2>
      <p className="text-[16px] sm:text-[18px] leading-[1.75] text-muted/70 font-medium mb-5 sm:mb-6 max-w-xl">
        You can contact me using the form or via the links below.
      </p>

      <form className="space-y-3 mb-8 sm:mb-10" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text" placeholder="Name" value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            className="w-full bg-transparent border border-ink/[0.08] rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-ink/20 transition-all placeholder:text-muted/25 text-[14px] font-medium"
          />
          <input
            type="email" placeholder="Email" value={formState.email}
            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
            className="w-full bg-transparent border border-ink/[0.08] rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-ink/20 transition-all placeholder:text-muted/25 text-[14px] font-medium"
          />
        </div>
        <textarea
          placeholder="Message" rows={5} value={formState.message}
          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
          className="w-full bg-transparent border border-ink/[0.08] rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-ink/20 transition-all placeholder:text-muted/25 text-[14px] font-medium resize-y"
        />

        <AnimatePresence mode="wait">
          {status === 'error' && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-[11px] font-bold text-red-500 uppercase tracking-widest font-mono">{errorMessage}</motion.p>
          )}
          {status === 'success' && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-[11px] font-bold text-accent uppercase tracking-widest font-mono">Message sent successfully!</motion.p>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between pt-1">
          <button type="submit"
            className="h-10 px-6 bg-ink text-bg hover:scale-[1.02] active:scale-[0.98] rounded-full text-[12px] sm:text-[13px] font-bold transition-all flex items-center gap-2">
            Send message
          </button>
          <div className="hidden sm:flex items-center gap-2 text-[12px] text-muted/35 font-medium">
            <span>or</span>
            <span className="text-sm leading-none">↵</span>
            <span className="font-mono uppercase tracking-tight">Enter to send</span>
          </div>
        </div>
      </form>

      {/* Social Links */}
      <div className="mb-8 sm:mb-10">
        {socials.map((social) => (
          <a key={social.label} href={social.href}
            className="flex items-center justify-between py-3.5 sm:py-4 group transition-all active:bg-ink/[0.02] -mx-2 px-2 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-muted/25 group-hover:text-ink transition-colors">{social.icon}</span>
              <span className="text-[16px] sm:text-[18px] font-medium text-muted/50 group-hover:text-ink transition-colors">{social.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] sm:text-[14px] text-muted/35 font-medium group-hover:text-ink transition-colors tracking-tight truncate max-w-[180px] sm:max-w-none">
                {social.value}
              </span>
              <ArrowUpRight size={14} className="text-muted/20 group-hover:text-ink transition-all shrink-0" />
            </div>
          </a>
        ))}
      </div>

      {/* Footer meta */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 text-[10px] sm:text-[11px] font-medium text-muted/25">
        <div className="flex items-center gap-2">
          <MapPin size={11} className="opacity-40" />
          <span>Hyderabad, India</span>
        </div>
        <span>© {currentYear} Mithun Reddy</span>
      </div>
    </footer>
  );
}
