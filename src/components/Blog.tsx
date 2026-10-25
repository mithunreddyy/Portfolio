import { ChevronRight, Clock } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { BlogPost } from "../types";

const ALL = "All";

export function Blog({ blogs }: { blogs: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState(ALL);

  // Categories come from the posts themselves, so the filter never offers an empty group
  const categories = useMemo(
    () => Array.from(new Set(blogs.map((post) => post.category).filter(Boolean))),
    [blogs],
  );

  const visiblePosts = activeCategory === ALL
    ? blogs
    : blogs.filter((post) => post.category === activeCategory);

  return (
    <section id="blog" className="section-container pt-3 sm:pt-4 pb-4 sm:pb-6">
      <div className="mb-3 sm:mb-4">
        <h2 className="text-[15px] sm:text-[17px] font-semibold text-ink">
          Writing
        </h2>
      </div>

      {categories.length > 1 && (
        <div role="group" aria-label="Filter posts by category" className="flex flex-wrap gap-2 mb-3 sm:mb-4">
          {[ALL, ...categories].map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category)}
                className={`text-[12px] sm:text-[13px] font-medium px-3 py-1 rounded-lg border transition-colors ${
                  isActive
                    ? "bg-ink text-bg border-ink"
                    : "border-ink/[0.08] text-muted hover:text-ink hover:border-ink/20"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      )}

      {blogs.length === 0 ? (
        <p className="text-[15px] text-muted font-medium">No posts yet.</p>
      ) : (
        <div className="flex flex-col">
          {visiblePosts.map((post, index) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group block py-3.5 sm:py-4 hover:bg-ink/[0.02] active:bg-ink/[0.03] transition-colors -mx-2 px-2 rounded-lg"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-8">
                  <span className="text-[14px] sm:text-[16px] font-mono text-muted/70 whitespace-nowrap shrink-0 group-hover:text-muted transition-colors">
                    {post.date || "NO DATE"}
                  </span>
                  <h3 className="flex-1 text-[16px] sm:text-[18px] font-semibold text-ink group-hover:translate-x-0.5 transition-transform duration-300 line-clamp-2 sm:line-clamp-1">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[14px] sm:text-[16px] font-mono text-muted/70 group-hover:text-muted/60 shrink-0 transition-colors">
                    <Clock size={15} className="opacity-90" />
                    <span>{(post.readTime || "2").split(' ')[0]}m</span>
                    <ChevronRight size={12} className="text-muted/20 sm:hidden" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
