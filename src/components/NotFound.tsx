import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen bg-bg text-ink flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-[520px]"
      >
        {/* Error Code */}
        <h1
          className="font-mono text-[clamp(6rem,18vw,10rem)] font-extrabold leading-none tracking-tighter text-ink mb-4 select-none"
        >
          404
        </h1>

        {/* Label */}
        <p className="font-mono text-[0.82rem] font-normal tracking-[0.14em] uppercase text-muted mb-7">
          Page Not Found
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-line mx-auto mb-7" />

        {/* Message */}
        <p className="text-[1.05rem] leading-[1.85] text-muted max-w-[400px] mx-auto mb-10">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        {/* Return Home */}
        <Link
          to="/"
          id="return-home-link"
          className="inline-flex items-center gap-2.5 font-mono text-[0.82rem] font-medium tracking-[0.08em] uppercase text-ink no-underline px-6 py-3 border border-ink/10 rounded-xl bg-ink/[0.03] backdrop-blur-lg transition-all duration-300 hover:bg-ink/[0.08] hover:border-ink/[0.18] hover:-translate-y-px hover:shadow-2xl active:translate-y-0 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 opacity-70 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100" strokeWidth={1.5} />
          Return Home
        </Link>
      </motion.div>

      {/* Footer */}
      <footer className="fixed bottom-8 left-0 right-0 text-center font-mono text-[0.72rem] tracking-[0.12em] uppercase text-ink/15">
        mithun reddy — portfolio
      </footer>
    </div>
  );
}
