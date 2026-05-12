import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PERSONAL_INFO, PROJECTS, BLOG_POSTS, EXPERIENCES } from '../constants';
import { BlogPost, Project, Experience, PersonalInfo } from '../types';
import { formatDate, calculateReadTime } from '../lib/utils';

export function usePortfolioData() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(PERSONAL_INFO);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [experiences, setExperiences] = useState<Experience[]>(EXPERIENCES);
  const [blogs, setBlogs] = useState<BlogPost[]>(BLOG_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          { data: prof },
          { data: projs },
          { data: exps },
          { data: bgs }
        ] = await Promise.all([
          supabase.from('profile').select('*').single(),
          supabase.from('projects').select('*').order('order_index'),
          supabase.from('experience').select('*').order('order_index'),
          supabase.from('blogs').select('*').order('created_at', { ascending: false })
        ]);

        if (prof) {
          setPersonalInfo({
            ...PERSONAL_INFO,
            ...prof,
            birthYear: prof.birth_year || PERSONAL_INFO.birthYear,
            resumeUrl: prof.resume_url || PERSONAL_INFO.resumeUrl,
          });
        }

        // Merge Projects: Supabase items + unique Local items
        if (Array.isArray(projs)) {
          const dbProjects = projs.map(p => ({
            ...p,
            description: Array.isArray(p.description) ? p.description : [p.description],
            tech: Array.isArray(p.tech) ? p.tech : [p.tech],
          }));
          const combined = [...dbProjects, ...PROJECTS.filter(p => !dbProjects.some(dp => dp.title === p.title))];
          setProjects(combined.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)));
        }

        // Merge Experiences
        if (Array.isArray(exps)) {
          const dbExps = exps.map(e => ({
            ...e,
            highlights: Array.isArray(e.highlights) ? e.highlights : [e.highlights],
          }));
          const combined = [...dbExps, ...EXPERIENCES.filter(e => !dbExps.some(de => de.role === e.role && de.company === e.company))];
          setExperiences(combined.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)));
        }

        // Merge Blogs: Only show PUBLISHED blogs (published !== false)
        if (Array.isArray(bgs)) {
          const dbBlogs = bgs.filter(b => b.published !== false).map(b => ({
            ...b,
            date: formatDate(b.date || b.created_at),
            readTime: calculateReadTime(b.content, b.excerpt),
          }));
          const combined = [...dbBlogs, ...BLOG_POSTS.filter(b => !dbBlogs.some(db => db.slug === b.slug))];
          // Also format local blogs for consistency
          const formattedCombined = combined.map(b => ({
            ...b,
            date: formatDate(b.date),
            readTime: calculateReadTime(b.content, b.excerpt)
          }));
          setBlogs(formattedCombined);
        }

      } catch (error) {
        console.error('Data sync failed, using defaults:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { personalInfo, projects, experiences, blogs, loading };
}
