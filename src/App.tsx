/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { ExperienceSection, Skills } from './components/Experience';
import { Blog } from './components/Blog';
import { CMS } from './components/CMS';
import { BlogPostView } from './components/BlogPostView';
import { Footer } from './components/Footer';
import { Dock } from './components/Dock';
import { SEO } from './components/SEO';
import { motion, useScroll, useSpring } from 'motion/react';

function Portfolio() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative font-sans">
      <SEO />

      <Header />
      <Dock />

      {/* Scroll progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent origin-left z-[200]"
        style={{ scaleX }}
      />

      <main className="relative z-10">
        <Hero />
        <Projects />
        <ExperienceSection />
        <Skills />
        <Blog />
      </main>

      <Footer />
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
        <Analytics />
      </div>
    </Router>
  );
}
