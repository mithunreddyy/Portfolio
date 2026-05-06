import { ChevronRight, Clock } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { usePortfolioData } from "../hooks/usePortfolioData";

import { BlogPost } from "../types";

export function Blog({ blogs }: { blogs: BlogPost[] }) {

  return (
    <section id="blog" className="section-container pt-6 sm:pt-8 pb-6 sm:pb-8">
      <div className="mb-3 sm:mb-4">
        <h2 className="text-[15px] sm:text-[17px] font-semibold text-ink">
          Writing
        </h2>
      </div>

      <div className="flex flex-col">
        {blogs.map((post, index) => (
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-8">
                <span className="text-[11px] sm:text-[12px] font-mono text-muted/50 whitespace-nowrap shrink-0">
                  {post.date}
                </span>
                <h3 className="flex-1 text-[16px] sm:text-[18px] font-semibold text-ink group-hover:translate-x-0.5 transition-transform duration-300 line-clamp-2 sm:line-clamp-1">
                  {post.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] font-mono text-muted/50 shrink-0">
                  <Clock size={11} className="opacity-60" />
                  <span>{(post.readTime || "").replace(/[^0-9]/g, "")} m</span>
                  <ChevronRight size={12} className="text-muted/20 sm:hidden" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex justify-start">
        <Link
          to="/cms"
          className="text-[11px] font-medium text-muted/15 hover:text-muted/50 active:text-ink transition-colors py-1.5"
        >
          Manage posts →
        </Link>
      </div>
    </section>
  );
}
