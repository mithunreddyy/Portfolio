import { useEffect, useState } from "react";
import { BLOG_POSTS, EXPERIENCES, PERSONAL_INFO, PROJECTS } from "../constants";
import { supabase } from "../lib/supabase";
import { BlogPost, Experience, PersonalInfo, Project } from "../types";

export function usePortfolioData() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(PERSONAL_INFO);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [experiences, setExperiences] = useState<Experience[]>(EXPERIENCES);
  const [blogs, setBlogs] = useState<BlogPost[]>(BLOG_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [{ data: prof }, { data: projs }, { data: exps }, { data: bgs }] =
          await Promise.all([
            supabase.from("profile").select("*").single(),
            supabase.from("projects").select("*").order("order_index"),
            supabase.from("experience").select("*").order("order_index"),
            supabase
              .from("blogs")
              .select("*")
              .order("created_at", { ascending: false }),
          ]);

        if (prof) {
          setPersonalInfo({
            ...PERSONAL_INFO,
            ...Object.fromEntries(
              Object.entries(prof).filter(([_, value]) => value != null),
            ),
            birthYear: prof.birth_year || PERSONAL_INFO.birthYear,
            resumeUrl: prof.resume_url || PERSONAL_INFO.resumeUrl,
          });
        }

        // Merge logic: Supabase items come FIRST, then defaults
        if (Array.isArray(projs)) {
          const dbProjects = projs.map((p) => ({
            ...p,
            description: Array.isArray(p.description)
              ? p.description
              : [p.description],
            tech: Array.isArray(p.tech) ? p.tech : [p.tech],
          }));
          setProjects([
            ...dbProjects,
            ...PROJECTS.filter(
              (p) => !dbProjects.some((dp) => dp.title === p.title),
            ),
          ]);
        }

        if (Array.isArray(exps)) {
          const dbExps = exps.map((e) => ({
            ...e,
            highlights: Array.isArray(e.highlights)
              ? e.highlights
              : [e.highlights],
          }));
          setExperiences([
            ...dbExps,
            ...EXPERIENCES.filter(
              (e) => !dbExps.some((de) => de.company === e.company),
            ),
          ]);
        }

        if (Array.isArray(bgs)) {
          const dbBlogs = bgs
            .filter((b) => b.published !== false)
            .map((b) => ({
              ...b,
              readTime: b.read_time || b.readTime || "",
            }));
          setBlogs([
            ...dbBlogs,
            ...BLOG_POSTS.filter(
              (b) => !dbBlogs.some((db) => db.slug === b.slug),
            ),
          ]);
        }
      } catch (err) {
        console.warn("Sync notice: Using local data as base.", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { personalInfo, projects, experiences, blogs, loading };
}
