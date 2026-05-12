import { motion, useScroll, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Blog } from './components/Blog';
import { BlogPostView } from './components/BlogPostView';
import { CMS } from './components/CMS';
import { CommandPalette } from './components/CommandPalette';
import { Dock } from './components/Dock';
import { ExperienceSection, Skills } from './components/Experience';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { SEO } from './components/SEO';
import { SmoothScroll } from './components/SmoothScroll';
import { usePortfolioData } from './hooks/usePortfolioData';

function Portfolio() {
  const { personalInfo, projects, experiences, blogs, loading } = usePortfolioData();



  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative font-sans">

      <SEO />
      <SmoothScroll />
      <CommandPalette />
     

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <Header personalInfo={personalInfo} />
        <Dock />

        {/* Scroll progress indicator */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-accent origin-left z-[200]"
          style={{ scaleX }}
        />

        <main className="relative z-10">
          <Hero personalInfo={personalInfo} />
          <Projects projects={projects} />
          <ExperienceSection experiences={experiences} />
          <Skills />
          <Blog blogs={blogs} />
        </main>

        <Footer />
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg text-ink relative selection:bg-accent/30 selection:text-ink">
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/cms" element={<CMS />} />
          <Route path="/blog/:slug" element={<BlogPostView />} />
        </Routes>
      </div>
    </Router>
  );
}
