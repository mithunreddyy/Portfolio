import { ArrowUpRight, ExternalLink, Github, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { Project } from '../types';

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
                className="cursor-pointer group active:scale-[0.98] transition-transform"
              >
                <div className="bg-bg rounded-xl shadow-xl overflow-hidden border border-ink/[0.06]">
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
          <div className="relative h-[380px] lg:h-[420px] flex items-center justify-center overflow-visible mt-4 sm:mt-6 max-w-[1200px] mx-auto px-10">
            <div className="relative w-full h-full flex items-center justify-center">
              {projects.map((project, index) => {
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
                    <div className="bg-bg rounded-2xl shadow-[0_30px_80px_-15px_rgba(0,0,0,0.7)] group-hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] overflow-hidden w-[280px] md:w-[300px] lg:w-[320px] aspect-[4/3] flex flex-col transition-all duration-500 border border-ink/[0.05]">
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
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-8 lg:p-12 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-bg/80 backdrop-blur-2xl"
            />
            
            <motion.div
              layoutId={selectedProject.id}
              initial={{ opacity: 0, scale: 0.9, y: isMobile ? 100 : 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: isMobile ? 100 : 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-bg w-full max-w-4xl max-h-[96dvh] sm:max-h-[85vh] overflow-hidden rounded-t-[24px] sm:rounded-[24px] border border-ink/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative z-10 flex flex-col"
            >
              {/* Decorative Background Glow */}
              <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-accent/5 blur-[120px] pointer-events-none" />

              {/* Header / Top Bar */}
              <div className="flex items-center justify-between px-6 py-3.5 sm:px-8 sm:py-4 border-b border-ink/5 shrink-0 bg-bg/50 backdrop-blur-sm z-20">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5 px-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/30" />
                  </div>
                  <span className="text-[10px] font-mono text-muted/40 uppercase tracking-[0.2em] ml-2">Project Case /{selectedProject.id}</span>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-ink/5 rounded-full transition-colors group"
                >
                  <X size={20} className="text-muted/60 group-hover:text-ink transition-colors" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6 sm:px-10 sm:py-10">
                <div className="max-w-4xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 sm:mb-10"
                  >
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ink tracking-tight mb-4 leading-[1.15]">
                      {selectedProject.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedProject.tech.map((t, i) => (
                        <span key={t} className="px-3 py-1 bg-ink/5 rounded-full text-[11px] font-mono text-muted/60 border border-ink/5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Narrative */}
                    <div className="lg:col-span-7 space-y-8 sm:space-y-10">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <p className="text-lg sm:text-xl text-ink/80 leading-relaxed font-medium">
                          {selectedProject.description[0]}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-5"
                      >
                        <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Core Infrastructure</h4>
                        <div className="grid grid-cols-1 gap-4">
                          {selectedProject.description.slice(1).map((line, i) => (
                            <div key={i} className="group p-4 rounded-2xl bg-ink/[0.02] border border-ink/5 hover:border-accent/20 hover:bg-accent/[0.02] transition-all duration-300">
                              <div className="flex gap-4 items-start">
                                <div className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                </div>
                                <p className="text-[15px] sm:text-[16px] text-muted/70 leading-relaxed group-hover:text-ink/80 transition-colors">
                                  {line}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    {/* Right Column: Visuals & Links */}
                    <div className="lg:col-span-5 space-y-6 sticky top-0">
                      {/* Terminal Visual */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-2xl border border-ink/10 bg-black/40 overflow-hidden shadow-2xl"
                      >
                        <div className="px-4 py-2 bg-ink/5 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-muted/30">runtime.sh</span>
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-ink/10" />
                            <div className="w-1.5 h-1.5 rounded-full bg-ink/10" />
                          </div>
                        </div>
                        <div className="p-6 font-mono text-[12px] leading-relaxed text-accent/60">
                          <div className="flex gap-3 mb-2">
                            <span className="text-green-500/40">$</span>
                            <span className="text-ink/40">init {selectedProject.id}</span>
                          </div>
                          <div className="text-muted/20">
                            {">"} mounting resources...<br/>
                            {">"} compiling dependencies...<br/>
                            {">"} optimized for production
                          </div>
                          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 opacity-30">
                            {selectedProject.tech.slice(0, 4).map(t => (
                              <span key={t}>#{t.toLowerCase()}</span>
                            ))}
                          </div>
                        </div>
                      </motion.div>

                      {/* Action Cards */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-4"
                      >
                        {selectedProject.link && (
                          <a 
                            href={selectedProject.link} 
                            target="_blank" 
                            rel="noreferrer"
                            className="group flex items-center justify-between p-4 rounded-xl bg-ink text-bg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2.5 bg-bg/10 rounded-xl group-hover:rotate-12 transition-transform">
                                <Github size={20} />
                              </div>
                              <div className="text-left">
                                <div className="text-[13px] font-bold">Source Code</div>
                                <div className="text-[10px] opacity-60 font-mono tracking-tight">github.com/{selectedProject.id}</div>
                              </div>
                            </div>
                            <ExternalLink size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                          </a>
                        )}

                        {selectedProject.demoUrl && (
                          <a 
                            href={selectedProject.demoUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="group flex items-center justify-between p-4 rounded-xl bg-bg border border-ink/10 hover:border-accent/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2.5 bg-accent/5 rounded-xl text-accent">
                                <ExternalLink size={20} />
                              </div>
                              <div className="text-left">
                                <div className="text-[13px] font-bold">Live Demonstration</div>
                                <div className="text-[10px] text-muted/60 font-mono tracking-tight">deployment_active.sh</div>
                              </div>
                            </div>
                            <ArrowUpRight size={18} className="text-muted/20 group-hover:text-accent transition-colors" />
                          </a>
                        )}
                      </motion.div>

                      {/* Stats / Meta Info */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="p-5 rounded-xl bg-ink/[0.01] border border-ink/5 space-y-3"
                      >
                         <div className="flex justify-between items-center text-[11px]">
                           <span className="text-muted/40 font-mono uppercase tracking-widest">Status</span>
                           <span className="text-green-500 font-bold flex items-center gap-1.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                             Production Ready
                           </span>
                         </div>
                         <div className="flex justify-between items-center text-[11px]">
                           <span className="text-muted/40 font-mono uppercase tracking-widest">Role</span>
                           <span className="text-ink font-bold">Lead Developer</span>
                         </div>
                         <div className="flex justify-between items-center text-[11px]">
                           <span className="text-muted/40 font-mono uppercase tracking-widest">Type</span>
                           <span className="text-ink font-bold">Open Source</span>
                         </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                {/* Mobile Spacing Footer */}
                <div className="h-20 sm:hidden" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
