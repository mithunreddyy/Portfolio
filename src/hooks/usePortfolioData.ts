import { BLOG_POSTS, EXPERIENCES, PERSONAL_INFO, PROJECTS } from '../constants';

export function usePortfolioData() {
  return {
    personalInfo: PERSONAL_INFO,
    projects: PROJECTS,
    experiences: EXPERIENCES,
    blogs: BLOG_POSTS,
  };
}
