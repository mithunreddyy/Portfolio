import { ExternalLink, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { PROJECTS } from '../constants';
import { Project } from '../types';

export function Projects() {
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
    { rotate: -4, x: -15, mdX: -180, y: 0, zIndex: 10 },
    { rotate: 3, x: 15, mdX: 180, y: -10, zIndex: 12 },
    { rotate: -2, x: 0, mdX: 0, y: 40, zIndex: 11 },
  ];

  return (
    <section id="projects" className="section-container pt-4 sm:pt-6 pb-6 sm:pb-10 relative overflow-visible">
      <div className="relative z-10">
        <div className="mb-3 sm:mb-4">
          <h2 className="text-[15px] sm:text-[17px] font-semibold text-ink mb-2 sm:mb-3">Work</h2>
          <p className="text-[16px] sm:text-[18px] leading-[1.75] text-muted/70 font-medium max-w-xl">
            Below are some select projects, ranging from AI infrastructure to developer tooling.
          </p>
        </div>

        {isMobile ? (
          <div className="space-y-3 mt-4 pb-4">
            {PROJECTS.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
                onClick={() => setSelectedProject(project)}
                className="cursor-pointer group active:scale-[0.98] transition-transform"
              >
                <div className="bg-bg rounded-xl shadow-lg overflow-hidden border border-ink/[0.06]">
                  <div className="h-7 bg-ink/[0.03] flex items-center px-3 gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-ink/10" />
                    <div className="w-1.5 h-1.5 rounded-full bg-ink/10" />
                    <div className="w-1.5 h-1.5 rounded-full bg-ink/10" />
                    <div className="ml-2 flex-1 h-3 bg-ink/5 rounded-full" />
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    <div className="space-y-1.5">
                      <h3 className="text-[14px] font-bold text-ink tracking-tight">{project.title}</h3>
                      <p className="text-[12px] text-muted/50 leading-relaxed line-clamp-2">{project.description[0]}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {project.tech.slice(0, 3).map(t => (
                          <span key={t} className="text-[9px] font-bold text-muted/30 uppercase tracking-widest">{t}</span>
                        ))}
                      </div>
                      <div className="p-2 bg-ink/5 rounded-md group-active:bg-ink group-active:text-bg transition-all">
                        <ExternalLink size={11} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="relative h-[380px] lg:h-[400px] flex items-center justify-center overflow-visible mt-8 sm:mt-12">
            <div className="relative w-full h-full flex items-center justify-center">
              {PROJECTS.map((project, index) => {
                const style = cardStyles[index % cardStyles.length];
                // Responsive offset calculation
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
                    className="absolute cursor-pointer group"
                    style={{ zIndex: style.zIndex }}
                  >
                    <div className="bg-bg rounded-2xl shadow-2xl overflow-hidden w-[280px] md:w-[300px] lg:w-[320px] aspect-[4/3] flex flex-col transition-all duration-500 border border-ink/[0.04]">
                      <div className="h-8 bg-ink/[0.03] flex items-center px-3.5 gap-1 border-b border-ink/[0.02]">
                        <div className="w-1.5 h-1.5 rounded-full bg-ink/10" />
                        <div className="w-1.5 h-1.5 rounded-full bg-ink/10" />
                        <div className="w-1.5 h-1.5 rounded-full bg-ink/10" />
                        <div className="ml-2 flex-1 h-3 bg-ink/5 rounded-full" />
                      </div>
                      <div className="flex-1 p-5 md:p-6 flex flex-col justify-between relative bg-gradient-to-b from-transparent to-ink/[0.01]">
                        <div className="space-y-2">
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
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 md:p-16">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-ink/60 backdrop-blur-md"
            />
            <motion.div
              layoutId={selectedProject.id}
              initial={{ opacity: 0, scale: 0.95, y: isMobile ? 80 : 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: isMobile ? 80 : 20 }}
              className="bg-bg w-full sm:max-w-3xl max-h-[92dvh] sm:max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl relative z-10 p-5 sm:p-8 md:p-12 scrollbar-hide"
            >
              <div className="w-8 h-0.5 bg-ink/10 rounded-full mx-auto mb-4 sm:hidden" />
              <button onClick={() => setSelectedProject(null)} className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 bg-bg hover:bg-ink hover:text-bg rounded-full transition-all group shadow-lg z-20">
                <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
              <div className="flex flex-col gap-5 sm:gap-8 pb-16 sm:pb-4">
                <div className="pr-8">
                  <span className="text-[10px] font-bold text-accent tracking-[0.3em] mb-1.5 block">Project case</span>
                  <h3 className="text-xl sm:text-2xl md:text-[28px] font-bold text-ink tracking-tight">{selectedProject.title}</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <p className="text-[16px] sm:text-[18px] text-ink leading-[1.75] font-medium">{selectedProject.description[0]}</p>
                    <div className="space-y-3">
                      <span className="text-[12px] sm:text-[13px] text-muted/40 font-semibold block">Key achievements</span>
                      <ul className="space-y-2.5">
                        {selectedProject.description.slice(1).map((line, i) => (
                          <li key={i} className="flex gap-3 text-[16px] sm:text-[18px] text-muted/70 leading-[1.75] font-normal">
                            <span className="text-accent mt-0.5 shrink-0">•</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <span className="text-[12px] sm:text-[13px] text-muted/40 font-semibold block">Technical stack</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tech.map(t => (
                          <span key={t} className="px-3.5 py-1.5 bg-ink/5 text-ink rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-accent/10 transition-colors">{t}</span>
                        ))}
                      </div>
                    </div>
                    {selectedProject.link && (
                      <a href={selectedProject.link} target="_blank" rel="noreferrer"
                        className="w-full py-3.5 bg-ink text-bg rounded-xl font-bold text-[12px] sm:text-[13px] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 tracking-tight shadow-lg">
                        Access repository <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
