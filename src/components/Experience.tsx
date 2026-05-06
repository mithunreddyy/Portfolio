import { motion } from 'motion/react';
import { SKILL_GROUPS } from '../constants';
import { usePortfolioData } from '../hooks/usePortfolioData';

const skillIconMap: Record<string, string> = {
  "TypeScript": "https://cdn.simpleicons.org/typescript/3178C6",
  "JavaScript (ES6+)": "https://cdn.simpleicons.org/javascript/F7DF1E",
  "Python": "https://cdn.simpleicons.org/python/3776AB",
  "HTML5": "https://cdn.simpleicons.org/html5/E34F26",
  "CSS3": "https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg",
  "LangChain": "https://cdn.simpleicons.org/langchain/white",
  "LangGraph": "https://cdn.simpleicons.org/langgraph/3399FF",
  "HuggingFace": "https://cdn.simpleicons.org/huggingface/FFD21E",
  "PyTorch": "https://cdn.simpleicons.org/pytorch/EE4C2C",
  "TensorFlow": "https://cdn.simpleicons.org/tensorflow/FF6F00",
  "PySpark": "https://cdn.simpleicons.org/apachespark/E25A1C",
  "Databricks": "https://cdn.simpleicons.org/databricks/FF3621",
  "PostgreSQL": "https://cdn.simpleicons.org/postgresql/4169E1",
  "MongoDB": "https://cdn.simpleicons.org/mongodb/47A248",
  "Redis": "https://cdn.simpleicons.org/redis/DC382D",
  "Cassandra": "https://cdn.simpleicons.org/apachecassandra/1287B1",
  "AWS": "https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  "GCP": "https://cdn.simpleicons.org/googlecloud/4285F4",
  "Azure": "https://raw.githubusercontent.com/devicons/devicon/master/icons/azure/azure-original.svg",
  "Docker": "https://cdn.simpleicons.org/docker/2496ED",
  "TerraForm": "https://cdn.simpleicons.org/terraform/7B42BC",
  "GitHub Actions": "https://cdn.simpleicons.org/githubactions/2088FF"
};

const allSkills = SKILL_GROUPS.flatMap(g => g.skills);

import { Experience } from '../types';

export function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section id="experience" className="section-container pt-6 sm:pt-8 pb-6 sm:pb-8">
      <div className="mb-4 sm:mb-5">
        <h2 className="text-[15px] sm:text-[17px] font-semibold text-ink">Experience</h2>
        <p className="text-[16px] sm:text-[18px] leading-[1.75] text-muted/70 font-medium max-w-xl">
          Throughout my career, I've worked on various projects, from building scalable systems to designing user-friendly interfaces.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6"
          >
            <div className="md:col-span-3">
              <span className="text-[12px] sm:text-[14px] text-muted/40 font-bold uppercase tracking-widest font-mono block mt-1">{exp.period}</span>
            </div>
            <div className="md:col-span-9 space-y-3">
              <div className="flex flex-wrap items-baseline gap-1.5">
                <h3 className="text-[16px] sm:text-[18px] font-semibold text-ink">{exp.role}</h3>
                <span className="text-[16px] sm:text-[18px] text-muted/40 font-medium">at</span>
                <span className="text-[16px] sm:text-[18px] text-ink font-semibold">{exp.company}</span>
              </div>
              <ul className="space-y-2.5 pl-0">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="text-[16px] sm:text-[18px] text-muted/60 leading-[1.75] font-medium flex gap-3">
                    <span className="text-muted/20 mt-0.5 shrink-0">·</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Stack — Flat colored icons, as-is ─── */
export function Skills() {
  return (
    <section id="skills" className="section-container pt-6 sm:pt-8 pb-6 sm:pb-8">
      <h2 className="text-[15px] sm:text-[17px] font-semibold text-ink text-left mb-4 sm:mb-5">Stack</h2>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
        {allSkills.map((skill, i) => (
          <motion.div
            key={skill}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.2, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative"
          >
            <img
              src={skillIconMap[skill] || ''}
              alt={skill}
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full px-2 py-0.5 bg-ink text-bg text-[8px] font-bold whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {skill}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
