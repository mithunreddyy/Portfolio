import { collection, getDocs, query, where } from 'firebase/firestore';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BLOG_POSTS } from '../constants';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { BlogPost } from '../types';
import { SEO } from './SEO';

export function BlogPostView() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'blogs'), where('slug', '==', slug));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setPost({ id: doc.id, ...doc.data() } as BlogPost);
        } else {
          const found = BLOG_POSTS.find((b: BlogPost) => b.slug === slug);
          setPost(found || null);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `blogs?slug=${slug}`);
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
          <Link to="/" className="text-accent hover:underline text-[12px] font-semibold py-2 inline-block">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg text-ink py-12 px-5 sm:py-16 sm:px-6 md:py-24"
    >
      <SEO
        title={post.title}
        description={post.excerpt}
        type="article"
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "author": { "@type": "Person", "name": "Mithun Reddy" },
          "datePublished": post.date,
          "mainEntityOfPage": { "@type": "WebPage", "@id": `https://mithunreddy.dev/blog/${post.slug}` }
        }}
      />
      <div className="max-w-[680px] mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[12px] font-medium text-muted/40 mb-10 sm:mb-12 hover:text-ink active:text-ink transition-colors py-1.5">
          <ArrowLeft size={14} className="shrink-0" /> Back
        </Link>

        <header className="mb-10 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] sm:text-[12px] font-medium text-muted/40 mb-6 sm:mb-7 gap-2">
            <span>{post.date}</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Clock size={11} className="opacity-50" />
                <span>{post.readTime.replace(/[^0-9]/g, '')} min read</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tag size={11} className="opacity-50" />
                <span>{post.content ? post.content.split(/\s+/).filter(Boolean).length : 0} words</span>
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-[1.15] text-ink mb-4">{post.title}</h1>
          <p className="text-[14px] sm:text-[15px] text-muted/50 leading-[1.75] font-normal">{post.excerpt}</p>
        </header>

        <article>
          <div className="space-y-5 text-muted/70 text-[14px] sm:text-[15px] md:text-base leading-[1.85] font-normal">
            {post.content ? (
              post.content.split('\n\n').map((para, i) => {
                if (para.trim().startsWith('•') || para.trim().startsWith('-')) {
                  const items = para.split('\n').filter(Boolean);
                  return (
                    <ul key={i} className="space-y-2.5 py-1">
                      {items.map((item, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="text-muted/20 shrink-0">•</span>
                          <span>{item.replace(/^[•-]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (/^\d+\.\s/.test(para.trim())) {
                  const items = para.split('\n').filter(Boolean);
                  return (
                    <div key={i} className="space-y-3 py-1">
                      {items.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          {item.includes(':') ? (
                            <>
                              <p className="text-ink font-bold text-[14px]">{item.split(':')[0]}:</p>
                              <p className="pl-4">{item.split(':').slice(1).join(':').trim()}</p>
                            </>
                          ) : (
                            <p>{item}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                }
                return <p key={i} className={i === 0 ? "text-muted block first-letter:text-ink" : ""}>{para}</p>;
              })
            ) : (
              <p>No content available for this post.</p>
            )}
          </div>
        </article>

        <footer className="mt-14 pt-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-ink/[0.04] shrink-0" />
            <div>
              <span className="text-ink font-bold text-[14px]">Mithun Reddy</span>
              <span className="text-[11px] text-muted/35 font-medium block mt-0.5">Software Engineer</span>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
