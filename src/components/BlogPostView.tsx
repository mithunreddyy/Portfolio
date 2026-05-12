import { Clock, CloudSun, CornerDownLeft, FileText, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BLOG_POSTS, PERSONAL_INFO } from "../constants";
import { supabase } from "../lib/supabase";
import { BlogPost } from "../types";
import { formatDate, calculateReadTime } from "../lib/utils";
import { SEO } from "./SEO";

/* ─── Content parser ─── */

type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; segments: TextSegment[] }
  | { type: "list"; style: "bullet" | "number"; items: ListItem[] };

type TextSegment = { text: string; bold: boolean };

interface ListItem {
  segments: TextSegment[];
  children?: ListItem[];
}

/** Parse **bold** markers inside a text string */
const parseInline = (raw: string): TextSegment[] => {
  const segments: TextSegment[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: raw.slice(lastIndex, match.index), bold: false });
    }
    segments.push({ text: match[1], bold: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < raw.length) {
    segments.push({ text: raw.slice(lastIndex), bold: false });
  }

  return segments.length ? segments : [{ text: raw, bold: false }];
};

const parseContent = (content: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  let currentBlock: ContentBlock | null = null;
  let pendingNumberedItem: ListItem | null = null;

  const flush = () => {
    if (pendingNumberedItem && currentBlock?.type === "list" && currentBlock.style === "number") {
      currentBlock.items.push(pendingNumberedItem);
      pendingNumberedItem = null;
    }
    if (currentBlock) {
      blocks.push(currentBlock);
      currentBlock = null;
    }
  };

  const flushPending = () => {
    if (pendingNumberedItem && currentBlock?.type === "list" && currentBlock.style === "number") {
      currentBlock.items.push(pendingNumberedItem);
      pendingNumberedItem = null;
    }
  };

  const lines = content.split("\n");

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      // Don't flush numbered list blocks on empty lines — they may have sub-bullets
      if (currentBlock?.type !== "list" || currentBlock.style !== "number") {
        flush();
      } else {
        flushPending();
      }
      continue;
    }

    const headingMatch = line.match(/^(.+?):$/);
    const bulletMatch = line.match(/^[•*-]\s+(.*)$/);
    const orderedMatch = line.match(/^(\d+)\.\s+(.*)$/);

    if (headingMatch && line.endsWith(":")) {
      flush();
      currentBlock = { type: "heading", text: headingMatch[1] };
      flush();
      continue;
    }

    if (orderedMatch) {
      if (currentBlock?.type !== "list" || currentBlock.style !== "number") {
        flush();
        currentBlock = { type: "list", style: "number", items: [] };
      } else {
        flushPending();
      }
      pendingNumberedItem = { segments: parseInline(orderedMatch[2]), children: [] };
      continue;
    }

    if (bulletMatch) {
      // Sub-bullet of a numbered list item
      if (pendingNumberedItem) {
        if (!pendingNumberedItem.children) pendingNumberedItem.children = [];
        pendingNumberedItem.children.push({ segments: parseInline(bulletMatch[1]) });
        continue;
      }

      // Standalone bullet list
      if (currentBlock?.type === "list" && currentBlock.style === "bullet") {
        currentBlock.items.push({ segments: parseInline(bulletMatch[1]) });
      } else {
        flush();
        currentBlock = {
          type: "list",
          style: "bullet",
          items: [{ segments: parseInline(bulletMatch[1]) }],
        };
      }
      continue;
    }

    // Regular paragraph text
    if (currentBlock?.type === "paragraph") {
      const existing = currentBlock.segments.map(s => s.text).join("");
      currentBlock.segments = parseInline(existing + " " + line);
    } else {
      flush();
      currentBlock = { type: "paragraph", segments: parseInline(line) };
    }
  }

  flushPending();
  flush();
  return blocks;
};

/* ─── Inline text renderer ─── */

function RichText({ segments }: { segments: TextSegment[] }) {
  return (
    <>
      {segments.map((seg, i) =>
        seg.bold ? (
          <strong key={i} className="font-semibold text-ink">
            {seg.text}
          </strong>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );
}



/* ─── Main component ─── */

export function BlogPostView() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>(BLOG_POSTS);
  const [weather, setWeather] = useState<{ temp: number } | null>(null);

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
          setPost({
            ...data,
            date: formatDate(data.date || data.created_at),
            readTime: calculateReadTime(data.content, data.excerpt),
          } as BlogPost);
        } else {
          // Fallback to local constants
          const found = BLOG_POSTS.find((b: BlogPost) => b.slug === slug);
          if (found) {
            setPost({
              ...found,
              date: formatDate(found.date),
              readTime: calculateReadTime(found.content, found.excerpt)
            });
          } else {
            setPost(null);
          }
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

  /* Fetch all blogs for "More" section */
  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const { data } = await supabase
          .from("blogs")
          .select("*")
          .eq("published", true)
          .order("date", { ascending: false });
        if (data && data.length > 0) {
          const mappedData = data.map(b => ({
            ...b,
            date: formatDate(b.date || b.created_at),
            readTime: calculateReadTime(b.content, b.excerpt),
          }));
          const combined = [
            ...mappedData,
            ...BLOG_POSTS.filter(b => !mappedData.some((db: BlogPost) => db.slug === b.slug)).map(b => ({
              ...b,
              date: formatDate(b.date),
              readTime: calculateReadTime(b.content, b.excerpt)
            })),
          ] as BlogPost[];
          setAllBlogs(combined);
        }
      } catch { /* use fallback */ }
    };
    fetchAllBlogs();
  }, []);

  /* Fetch weather for Hyderabad */
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=17.385&longitude=78.4867&current_weather=true"
        );
        const json = await res.json();
        if (json.current_weather) {
          setWeather({ temp: Math.round(json.current_weather.temperature) });
        }
      } catch { /* silent fail */ }
    };
    fetchWeather();
  }, []);

  /* ─── Loading state ─── */
  if (loading) {
    return (
      <div className="blogpost-root blogpost-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.97, 1.03, 0.97] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="blogpost-loader"
        />
      </div>
    );
  }

  /* ─── 404 state ─── */
  if (!post) {
    return (
      <div className="blogpost-root blogpost-center">
        <div style={{ textAlign: "center" }}>
          <h1 className="blogpost-404-title">Post not found</h1>
          <Link to="/" className="blogpost-404-link">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const contentBlocks = post.content ? parseContent(post.content) : [];
  const allText = [post.excerpt, post.content].filter(Boolean).join(" ");
  const wordCount = allText.split(/\s+/).filter(Boolean).length;
  const readMinutes = parseInt(post.readTime.split(" ")[0], 10);
  const excerptSegments = parseInline(post.excerpt || "");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="blogpost-root"
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

      <div className="blogpost-container">
        {/* ─── Back button ─── */}
        <Link to="/" className="blogpost-back" id="blog-back-button">
          <CornerDownLeft size={14} strokeWidth={1.5} />
          <span>BACK</span>
        </Link>

        {/* ─── Meta row ─── */}
        <div className="blogpost-meta-row">
          <span className="blogpost-meta-date">{post.date}</span>
          <div className="blogpost-meta-stats">
            <span className="blogpost-meta-stat">
              <Clock size={13} strokeWidth={1.5} />
              {readMinutes} m
            </span>
            <span className="blogpost-meta-stat">
              <FileText size={13} strokeWidth={1.5} />
              {wordCount} words
            </span>
          </div>
        </div>

        {/* ─── Title ─── */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="blogpost-title"
        >
          {post.title.split("\n").map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </motion.h1>

        {/* ─── Intro paragraph (excerpt as lead) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="blogpost-lead"
        >
          <RichText segments={excerptSegments} />
        </motion.div>

        {/* ─── Article content ─── */}
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="blogpost-article"
        >
          {contentBlocks.length ? (
            contentBlocks.map((block, index) => {
              if (block.type === "heading") {
                return (
                  <h2 key={index} className="blogpost-h2">
                    {block.text}:
                  </h2>
                );
              }

              if (block.type === "paragraph") {
                return (
                  <p key={index} className="blogpost-paragraph">
                    <RichText segments={block.segments} />
                  </p>
                );
              }

              /* ─── Lists ─── */
              if (block.style === "number") {
                return (
                  <ol key={index} className="blogpost-ol">
                    {block.items.map((item, i) => (
                      <li key={i} className="blogpost-ol-item">
                        <span className="blogpost-ol-number">{i + 1}.</span>
                        <div>
                          <span className="blogpost-ol-label">
                            <RichText segments={item.segments} />
                          </span>
                          {item.children && item.children.length > 0 && (
                            <ul className="blogpost-sub-ul">
                              {item.children.map((child, ci) => (
                                <li key={ci} className="blogpost-sub-li">
                                  <span className="blogpost-bullet">•</span>
                                  <span>
                                    <RichText segments={child.segments} />
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                );
              }

              return (
                <ul key={index} className="blogpost-ul">
                  {block.items.map((item, i) => (
                    <li key={i} className="blogpost-li">
                      <span className="blogpost-bullet">•</span>
                      <span>
                        <RichText segments={item.segments} />
                      </span>
                    </li>
                  ))}
                </ul>
              );
            })
          ) : (
            <p className="blogpost-paragraph" style={{ opacity: 0.5 }}>
              No content available for this post.
            </p>
          )}
        </motion.article>

        {/* ─── More posts ─── */}
        {(() => {
          const otherPosts = allBlogs.filter(b => b.slug !== slug);
          if (otherPosts.length === 0) return null;
          return (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="blogpost-more"
            >
              <span className="blogpost-more-label">MORE</span>
              <div className="blogpost-more-list">
                {otherPosts.map((b) => (
                  <Link
                    key={b.slug}
                    to={`/blog/${b.slug}`}
                    className="blogpost-more-row"
                  >
                    <span className="blogpost-more-date">
                      {b.date}
                    </span>
                    <span className="blogpost-more-title">
                      {b.title.replace(/\n/g, " ")}
                    </span>
                    <span className="blogpost-more-time">
                      <Clock size={12} strokeWidth={1.5} />
                      {b.readTime.split(" ")[0]} m
                    </span>
                  </Link>
                ))}
              </div>
            </motion.section>
          );
        })()}

        {/* ─── Footer ─── */}
        <footer className="blogpost-footer">
          <div className="blogpost-footer-meta">
            <span className="blogpost-footer-location">
              <MapPin size={13} strokeWidth={1.5} />
              {PERSONAL_INFO.location.toUpperCase()}
            </span>
            {weather && (
              <span className="blogpost-footer-weather">
                <CloudSun size={14} strokeWidth={1.5} />
                {weather.temp}°C
              </span>
            )}
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
