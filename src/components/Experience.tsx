import { motion } from 'motion/react';
import { SKILL_GROUPS, EXPERIENCES } from '../constants';

const skillIconMap: Record<string, string> = {
  "TypeScript": "https://cdn.simpleicons.org/typescript/3178C6",
  "JavaScript (ES6+)": "https://cdn.simpleicons.org/javascript/F7DF1E",
  "Python": "https://cdn.simpleicons.org/python/3776AB",
  "SQL": "https://cdn.simpleicons.org/postgresql/4169E1",
  "HTML5": "https://cdn.simpleicons.org/html5/E34F26",
  "CSS3": "https://cdn.simpleicons.org/css3/1572B6",
  "LangChain": "https://svgl.app/library/langchain.svg",
  "LangGraph": "https://svgl.app/library/langchain.svg",
  "HuggingFace": "https://cdn.simpleicons.org/huggingface/FFD21E",
  "RAG": "https://cdn.simpleicons.org/openai/412991",
  "Vector Databases": "https://cdn.simpleicons.org/pinecone/12B886",
  "PyTorch": "https://cdn.simpleicons.org/pytorch/EE4C2C",
  "TensorFlow": "https://cdn.simpleicons.org/tensorflow/FF6F00",
  "PySpark": "https://cdn.simpleicons.org/apachespark/E25A1C",
  "Databricks": "https://cdn.simpleicons.org/databricks/FF3621",
  "PostgreSQL": "https://cdn.simpleicons.org/postgresql/4169E1",
  "MongoDB": "https://cdn.simpleicons.org/mongodb/47A248",
  "Redis": "https://cdn.simpleicons.org/redis/DC382D",
  "Cassandra": "https://cdn.simpleicons.org/apachecassandra/1287B1",
  "AWS": "https://cdn.simpleicons.org/amazonwebservices/FF9900",
  "GCP": "https://cdn.simpleicons.org/googlecloud/4285F4",
  "Azure": "https://cdn.simpleicons.org/microsoftazure/0078D4",
  "Docker": "https://cdn.simpleicons.org/docker/2496ED",
  "TerraForm": "https://cdn.simpleicons.org/terraform/7B42BC",
  "GitHub Actions": "https://cdn.simpleicons.org/githubactions/2088FF"
};

const allSkills = SKILL_GROUPS.flatMap(g => g.skills);

export function ExperienceSection() {
  return (
    <section id="experience" className="section-container pt-6 sm:pt-10 pb-8 sm:pb-12">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-[15px] sm:text-[17px] font-semibold text-ink mb-3">Experience</h2>
        <p className="text-[14px] sm:text-[15px] leading-[1.75] text-muted/70 font-medium max-w-xl">
          Throughout my career, I've worked on various projects, from building scalable systems to designing user-friendly interfaces.
        </p>
      </div>

      <div className="space-y-8 sm:space-y-10">
        {EXPERIENCES.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6"
          >
            <div className="md:col-span-3">
              <span className="text-[11px] sm:text-[12px] text-muted/40 font-bold uppercase tracking-widest font-mono block">{exp.period}</span>
            </div>
            <div className="md:col-span-9 space-y-3">
              <div className="flex flex-wrap items-baseline gap-1.5">
                <h3 className="text-[14px] sm:text-[15px] font-semibold text-ink">{exp.role}</h3>
                <span className="text-[14px] sm:text-[15px] text-muted/40 font-medium">at</span>
                <span className="text-[14px] sm:text-[15px] text-ink font-semibold">{exp.company}</span>
              </div>
              <ul className="space-y-2.5 pl-0">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="text-[13px] sm:text-[14px] text-muted/60 leading-[1.75] font-medium flex gap-3">
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
    <section id="skills" className="section-container pt-6 sm:pt-8 pb-8 sm:pb-12">
      <h2 className="text-[15px] sm:text-[17px] font-semibold text-ink text-center mb-5 sm:mb-6">Stack</h2>

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
