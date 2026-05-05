import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PERSONAL_INFO, PROJECTS, EXPERIENCES, BLOG_POSTS } from '../constants';
import { PersonalInfo, Project, Experience, BlogPost } from '../types';

export function usePortfolioData() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(PERSONAL_INFO);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [experiences, setExperiences] = useState<Experience[]>(EXPERIENCES);
  const [blogs, setBlogs] = useState<BlogPost[]>(BLOG_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listen to Settings/General
    const unsubscribeGeneral = onSnapshot(doc(db, 'settings', 'general'), (doc) => {
      if (doc.exists()) {
        setPersonalInfo(doc.data() as PersonalInfo);
      }
    });

    // 2. Listen to Projects
    const unsubscribeProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Project));
      if (docs.length > 0) setProjects(docs);
    });

    // 3. Listen to Experience
    const unsubscribeExperience = onSnapshot(collection(db, 'experience'), (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Experience));
      if (docs.length > 0) setExperiences(docs);
    });

    // 4. Listen to Blogs
    const unsubscribeBlogs = onSnapshot(collection(db, 'blogs'), (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
      if (docs.length > 0) setBlogs(docs);
    });

    setLoading(false);

    return () => {
      unsubscribeGeneral();
      unsubscribeProjects();
      unsubscribeExperience();
      unsubscribeBlogs();
    };
  }, []);

  return { personalInfo, projects, experiences, blogs, loading };
}
