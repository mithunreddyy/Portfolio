import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BLOG_POSTS } from "../constants";
import { supabase } from "../lib/supabase";
import { BlogPost } from "../types";
import { SEO } from "./SEO";

type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; style: "bullet" | "number"; items: string[] };

const parseContent = (content: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  let currentBlock: ContentBlock | null = null;

  const flush = () => {
    if (currentBlock) {
      blocks.push(currentBlock);
      currentBlock = null;
    }
  };

  const lines = content.split("\n");

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flush();
      continue;
    }

    const headingMatch = line.match(/^(.+?):$/);
    const bulletMatch = line.match(/^[•*-]\s+(.*)$/);
    const orderedMatch = line.match(/^\d+\.\s+(.*)$/);

    if (headingMatch && line.endsWith(":")) {
      flush();
      currentBlock = { type: "heading", text: headingMatch[1] };
      flush();
      continue;
    }

    if (bulletMatch) {
      if (currentBlock?.type === "list" && currentBlock.style === "bullet") {
        currentBlock.items.push(bulletMatch[1]);
      } else {
        flush();
        currentBlock = {
          type: "list",
          style: "bullet",
          items: [bulletMatch[1]],
        };
      }
      continue;
    }

    if (orderedMatch) {
      const lineText = orderedMatch[1];
      if (currentBlock?.type === "list" && currentBlock.style === "number") {
        currentBlock.items.push(lineText);
      } else {
        flush();
        currentBlock = { type: "list", style: "number", items: [lineText] };
      }
      continue;
    }

    if (currentBlock?.type === "paragraph") {
      currentBlock.text += ` ${line}`;
    } else {
      flush();
      currentBlock = { type: "paragraph", text: line };
    }
  }

  flush();
  return blocks;
};

export function BlogPostView() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("slug", slug)
          .single();

        if (data && !error) {
          setPost(data as BlogPost);
        } else {
          // Fallback to local constants
          const found = BLOG_POSTS.find((b: BlogPost) => b.slug === slug);
          setPost(found || null);
        }
      } catch (error) {
        console.error(
          "Supabase fetch error, falling back to local constants",
          error,
        );
        const found = BLOG_POSTS.find((b: BlogPost) => b.slug === slug);
        setPost(found || null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-10 h-10 bg-accent/20 rounded-full blur-xl"
        />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="text-xl font-bold text-ink mb-4">Post not found</h1>
          <Link
            to="/"
            className="text-accent hover:underline text-[12px] font-semibold py-2 inline-block"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const contentBlocks = post.content ? parseContent(post.content) : [];
  const wordCount = post.content
    ? post.content.split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg text-ink py-10 px-5 sm:py-14 sm:px-6 md:py-16"
    >
      <SEO
        title={post.title}
        description={post.excerpt}
        type="article"
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          author: { "@type": "Person", name: "Mithun Reddy" },
          datePublished: post.date,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://mithunreddy.dev/blog/${post.slug}`,
          },
        }}
      />

      <div className="max-w-[740px] mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-[12px] font-medium text-muted/40 hover:text-ink hover:border-white/15 transition-colors"
        >
          <ArrowLeft size={14} className="shrink-0" /> Back
        </Link>

        <header className="mt-8 mb-10">
          <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-[12px] uppercase tracking-[0.26em] font-medium text-muted/50 mb-5">
            <span className="inline-flex items-center rounded-full border border-muted/15 px-3 py-1 text-muted/60">
              {post.category}
            </span>
            <span>{post.date}</span>
            <span>{(post.readTime || "").replace(/[^0-9]/g, "")} min read</span>
            <span>{wordCount} words</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] text-ink mb-4">
            {post.title}
          </h1>
          <p className="max-w-[680px] text-[17px] sm:text-[18px] text-muted/50 leading-[1.8]">
            {post.excerpt}
          </p>
        </header>

        <article className="rounded-[32px] border border-white/10 bg-ink/5 p-6 sm:p-8 md:p-10 shadow-[0_40px_120px_-80px_rgba(15,23,42,0.55)]">
          <div className="space-y-8 text-[16px] sm:text-[18px] leading-[1.85] text-muted/70 font-normal">
            {contentBlocks.length ? (
              contentBlocks.map((block, index) => {
                if (block.type === "heading") {
                  return (
                    <h2
                      key={index}
                      className="text-lg sm:text-xl font-semibold text-ink leading-[1.3]"
                    >
                      {block.text}
                    </h2>
                  );
                }

                if (block.type === "paragraph") {
                  return (
                    <p
                      key={index}
                      className="text-[17px] sm:text-[18px] leading-[1.95] text-muted/80"
                    >
                      {block.text}
                    </p>
                  );
                }

                return (
                  <div key={index}>
                    {block.style === "number" ? (
                      <ol className="space-y-4 list-decimal list-inside text-muted/70">
                        {block.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="pl-2 text-ink">
                            {item}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <ul className="space-y-3 list-none">
                        {block.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex gap-3">
                            <span className="mt-1 text-accent">•</span>
                            <span className="text-ink/90">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-[17px] text-muted/70">
                No content available for this post.
              </p>
            )}
          </div>
        </article>

        <footer className="mt-12 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-ink/[0.08] shrink-0" />
              <div>
                <p className="text-[14px] font-semibold text-ink">
                  Mithun Reddy
                </p>
                <p className="text-[11px] text-muted/45 uppercase tracking-[0.18em]">
                  Software Engineer
                </p>
              </div>
            </div>
            <p className="text-sm text-muted/50 max-w-[420px] leading-[1.7]">
              Building modern digital experiences that bridge product design and
              engineering with thoughtful UI and robust performance.
            </p>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
