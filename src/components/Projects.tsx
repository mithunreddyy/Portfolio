import { ArrowUpRight, ExternalLink, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { Project } from '../types';

const cardLinkClass =
  'inline-flex items-center gap-1 min-h-[44px] text-[15px] font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink transition-colors';

export function Projects({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (selectedProject) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setSelectedProject(null);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const cardStyles = [
    { rotate: -4, x: 0, mdX: -320, y: -60, zIndex: 10 },
    { rotate: 4, x: 0, mdX: -140, y: 60, zIndex: 20 },
    { rotate: -4, x: 0, mdX: 140, y: -60, zIndex: 10 },
    { rotate: 4, x: 0, mdX: 320, y: 60, zIndex: 20 },
  ];

  return (
    <section id="projects" className="w-full pt-3 sm:pt-4 pb-4 sm:pb-6 relative overflow-visible">
      <div className="relative z-10">
        <div className="section-container mb-3 sm:mb-4">
          <h2 className="text-[15px] sm:text-[17px] font-semibold text-ink mb-2 sm:mb-3">Work</h2>
          <p className="text-[16px] sm:text-[18px] leading-[1.75] text-muted/70 font-medium max-w-xl">
            Below are some select projects, ranging from AI infrastructure to developer tooling.
          </p>
        </div>

        {isMobile ? (
          <div className="section-container space-y-2.5 mt-3 pb-2">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
                onClick={() => setSelectedProject(project)}
                className="cursor-pointer group active:scale-[0.98] transition-transform will-change-transform"
              >
                <motion.div layoutId={`card-${project.id}`} className="bg-bg rounded-lg shadow-lg dark:shadow-[0_30px_60px_-15px_rgba(255,255,255,0.05)] overflow-hidden border border-ink/[0.1]">
                  <div className="h-7 bg-ink/[0.03] flex items-center px-3 gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/20 border border-red-500/30" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/20 border border-amber-500/30" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/20 border border-green-500/30" />
                    <div className="ml-2 flex-1 h-3 bg-ink/5 rounded-full" />
                  </div>
                  <div className="p-3.5 flex flex-col gap-2.5">
                    <div className="space-y-1">
                      <h3 className="text-[14px] font-bold text-ink tracking-tight">{project.title}</h3>
                      <p className="text-[12px] text-muted/50 leading-relaxed line-clamp-2">{project.description[0]}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {project.tech.slice(0, 3).map(t => (
                          <span key={t} className="text-[9px] font-bold text-muted/30 uppercase tracking-none">{t}</span>
                        ))}
                      </div>
                      <div className="p-2 bg-ink/5 rounded-md group-active:bg-ink group-active:text-bg transition-all">
                        <ExternalLink size={11} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="relative h-[380px] lg:h-[420px] flex items-center justify-center overflow-visible mt-4 sm:mt-6 max-w-[1200px] mx-auto px-10">
            <div className="relative w-full h-full flex items-center justify-center">
              {projects.map((project, index) => {
                const style = cardStyles[index % cardStyles.length];
                const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
                const currentOffset = isTablet ? style.mdX * 0.8 : style.mdX; // Tighter spread on tablet
                
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30, rotate: style.rotate }}
                    whileInView={{
                      opacity: 1, y: style.y,
                      x: currentOffset,
                      rotate: style.rotate
                    }}
                    whileHover={{
                      scale: 1.05, zIndex: 100, rotate: 0, y: style.y - 10,
                      transition: { duration: 0.2 }
                    }}
                    transition={{ delay: index * 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                    viewport={{ once: true }}
                    onClick={() => setSelectedProject(project)}
                    className="absolute cursor-pointer group will-change-transform"
                    style={{ zIndex: style.zIndex }}
                  >
                    <motion.div layoutId={`card-${project.id}`} className="bg-bg rounded-2xl shadow-xl group-hover:shadow-2xl dark:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.05)] dark:group-hover:shadow-[0_30px_60px_-15px_rgba(255,255,255,0.08)] overflow-hidden w-[280px] md:w-[300px] lg:w-[320px] aspect-[4/3] flex flex-col transition-shadow duration-500 border border-ink/[0.05]">
                      <div className="h-7 bg-ink/[0.03] flex items-center px-3 gap-1 border-b border-ink/[0.02]">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500/20 border border-red-500/30" />
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500/20 border border-amber-500/30" />
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500/20 border border-green-500/30" />
                        <div className="ml-2 flex-1 h-3 bg-ink/5 rounded-full" />
                      </div>
                      <div className="flex-1 p-4 md:p-5 flex flex-col justify-between relative bg-gradient-to-b from-transparent to-ink/[0.01]">
                        <div className="space-y-1.5">
                          <h3 className="text-[14px] md:text-[15px] font-bold text-ink tracking-tight">{project.title}</h3>
                          <p className="text-[12px] text-muted/50 leading-relaxed line-clamp-3">{project.description[0]}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {project.tech.slice(0, 2).map(t => (
                              <span key={t} className="text-[9px] font-bold text-muted/30 uppercase tracking-widest">{t}</span>
                            ))}
                          </div>
                          <div className="p-2 bg-ink/5 rounded-md group-hover:bg-ink group-hover:text-bg transition-all">
                            <ExternalLink size={11} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-bg/60"
            />

            <motion.div
              layoutId={`card-${selectedProject.id}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-dialog-title"
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative z-10 w-full max-w-[560px] max-h-[85dvh] overflow-y-auto bg-bg rounded-[24px] border border-ink/10"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.2 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="p-6 sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3
                    id="project-dialog-title"
                    className="text-[22px] sm:text-[26px] font-semibold text-ink tracking-tight leading-tight"
                  >
                    {selectedProject.title}
                  </h3>
                  <button
                    type="button"
                    autoFocus
                    onClick={() => setSelectedProject(null)}
                    aria-label="Close project"
                    className="-mr-2 -mt-2 flex items-center justify-center w-11 h-11 shrink-0 rounded-full text-muted hover:text-ink hover:bg-ink/5 transition-colors"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>

                <p className="mt-3 text-[16px] sm:text-[17px] leading-[1.7] text-ink">
                  {selectedProject.description[0]}
                </p>

                {selectedProject.description.length > 1 && (
                  <ul className="mt-5 space-y-3">
                    {selectedProject.description.slice(1).map(line => (
                      <li key={line} className="text-[15px] leading-[1.7] text-muted">
                        {line}
                      </li>
                    ))}
                  </ul>
                )}

                <p className="mt-6 font-mono text-[12px] sm:text-[13px] leading-relaxed text-muted">
                  {selectedProject.tech.join('   ')}
                </p>

                {(selectedProject.link || selectedProject.demoUrl) && (
                  <div className="mt-2 flex flex-wrap gap-x-6">
                    {selectedProject.link && (
                      <a href={selectedProject.link} target="_blank" rel="noreferrer" className={cardLinkClass}>
                        Source
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    )}
                    {selectedProject.demoUrl && (
                      <a href={selectedProject.demoUrl} target="_blank" rel="noreferrer" className={cardLinkClass}>
                        Live
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
