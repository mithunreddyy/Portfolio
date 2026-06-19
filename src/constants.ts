import { BlogPost, Experience, Project, SkillGroup } from './types';

export const PERSONAL_INFO = {
  name: "Mithun Reddy",
  role: "Full-Stack Software Engineer & AI Enthusiast",
  location: "Hyderabad, India",
  email: "mithunreddy@outlook.in",
  github: "mithunreddyy",
  linkedin: "mithunreddyyy",
  birthYear: 1999,
  resumeUrl: "/mithunresume.pdf",
  summary: "a full-stack software engineer based in Hyderabad, India 🇮🇳 where I specialize in crafting scalable web architectures with a strong focus on machine learning pipelines, system performance, and backend optimization."
};

export const EXPERIENCES: Experience[] = [
  {
    id: "pentagram",
    role: "Full-Stack Engineer",
    company: "Pentagram InfoTech",
    location: "Hyderabad, India",
    period: "2024 — Present",
    highlights: [
      "Architected a modular microservices ecosystem handling authentication, order management, analytics, and workflow automation — led a team of 6 across Frontend, Backend, and DevOps within Agile sprints.",
      "Built highly optimized RESTful APIs processing millions of monthly transactions at sub-200ms latency using PostgreSQL tuning, materialized views, connection pooling, and Redis caching layers.",
      "Developed advanced data pipelines using Python, SQL, and PySpark to automate BI workflows, cutting 20+ hours/week of manual effort and enabling real-time reporting dashboards.",
      "Implemented IaC with Terraform and Docker-based CI/CD via GitHub Actions, delivering 20+ major releases with zero critical incidents and 99.95% platform availability."
    ]
  },
  {
    id: "zensar",
    role: "Software Engineer",
    company: "Zensar Technologies",
    location: "Hyderabad, India",
    period: "2022 — 2023",
    highlights: [
      "Led the migration from monolithic services to event-driven microservices using Node.js, Express, Python, AWS SQS/SNS — enabling resilient high-volume transaction processing with near-zero message failures.",
      "Re-engineered PostgreSQL infrastructure with advanced indexing, query optimization, partitioning, and materialized views, reducing API response times from 800ms to under 200ms.",
      "Designed distributed caching layers with Redis and AWS CloudFront, decreasing database load by 60% and powering real-time analytics dashboards at sub-100ms response times.",
      "Built cloud-native infrastructure on AWS (EC2, S3, RDS, Lambda, CloudFront) with Terraform IaC and automated CI/CD pipelines via Docker and GitHub Actions, achieving 99.99% uptime."
    ]
  }
];

export const PROJECTS: Project[] = [
  {
    id: "career-architect",
    title: "Autonomous Career Architect",
    description: [
      "An automated career intelligence suite designed to bridge the gap between job descriptions and application artifacts.",
      "Engineered a zero-cost CLI pipeline that extracts high-fidelity role signals from unstructured job postings.",
      "Developed a custom ranking engine using BM25 algorithms to align project evidence with target competencies.",
      "Automated the production of ATS-optimized resumes and cover letters across multiple LaTeX templates."
    ],
    tech: ["Python", "BM25", "LaTeX", "Streamlit", "Ollama"],
    link: "https://github.com/mithunreddyy/career-architect",
    demoUrl: "https://career-architect-demo.vercel.app"
  },
  {
    id: "local-pilot",
    title: "LocalPilot",
    description: [
      "A privacy-first AI coding companion providing local intelligence directly within the VS Code environment.",
      "Built a robust FastAPI backend coordinating with a custom VS Code extension for seamless inline completions.",
      "Implemented a hybrid indexing strategy using advanced symbol extraction for high-dimensional code analysis.",
      "Optimized code completion accuracy by combining static analysis with symbol-level context extraction."
    ],
    tech: ["Python", "TypeScript", "FastAPI", "SQLite", "CodeLlama"],
    link: "https://github.com/mithunreddyy/localpilot"
  },
  {
    id: "prompt-vault",
    title: "PromptVault",
    description: [
      "A sophisticated prompt-engineering workbench for versioned management and systematic evaluation of AI prompts.",
      "Integrated a structured evaluation layer to benchmark prompt performance against diverse datasets.",
      "Engineered automated scoring mechanisms using exact-match logic and LLM-based verification (Ollama).",
      "Designed a responsive React interface for real-time prompt iteration and version history tracking."
    ],
    tech: ["Python", "FastAPI", "SQLite", "React", "Docker"],
    link: "https://github.com/mithunreddyy/promptvault",
    demoUrl: "https://prompt-vault.onrender.com"
  },
  {
    id: "portfolio",
    title: "Portfolio",
    description: [
      "A premium, minimalist developer portfolio focused on high-end editorial aesthetics and production-grade CMS infrastructure.",
      "Engineered a dual-source synchronization strategy using Supabase for real-time updates and local constants for offline resiliency.",
      "Implemented an immersive 'Scattered Card' layout and high-fidelity terminal visuals using Motion (Framer Motion).",
      "Integrated real-time location-aware data tracking and weather information using the Open-Meteo API."
    ],
    tech: ["React 19", "TypeScript", "Tailwind CSS v4", "Supabase", "Motion"],
    link: "https://github.com/mithunreddyy/Portfolio",
    demoUrl: "https://mithunr.vercel.app/"
  }
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: "Languages",
    skills: ["TypeScript", "JavaScript (ES6+)", "Python", "HTML5", "CSS3"]
  },
  {
    category: "AI & LLMs",
    skills: ["LangChain", "LangGraph", "HuggingFace", "PyTorch", "TensorFlow"]
  },
  {
    category: "Data Engineering",
    skills: ["PySpark", "Databricks", "PostgreSQL", "MongoDB", "Redis", "Cassandra"]
  },
  {
    category: "Cloud & DevOps",
    skills: ["AWS", "GCP", "Azure", "Docker", "TerraForm", "GitHub Actions"]
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "design-engineer-mindset",
    slug: "design-engineer-mindset",
    title: "How to think like both\na designer & engineer",
    date: "FEB 21, 2025",
    excerpt: "Design and engineering are often seen as separate disciplines, but the best digital products come from a deep **understanding of both worlds**. Thinking like a designer **and** an engineer allows for better decision-making, smoother collaboration, and faster execution.",
    content: "The Challenges of Bridging the Gap:\n\n• Designers focus on **usability, aesthetics, and user experience**.\n• Engineers focus on **performance, scalability, and feasibility**.\n• The conflict? Designs that look amazing on Figma might be **impractical to build**, and engineers might overlook **UX nuances** that designers care about.\n\nHow to Think Like Both:\n\n1. Learn the Basics of Both Disciplines:\n\n• If you're a designer, learn HTML, CSS, and JavaScript fundamentals.\n• If you're an engineer, dive into design principles, typography, and color theory.\n\n2. Prioritize Feasibility Early On:\n\n• When designing, consider how components will translate into reusable UI elements.\n• When coding, respect the design intent and avoid unnecessary compromises.",
    category: "Product Design",
    readTime: "2 min read"
  },
  {
    id: "distributed-caching",
    slug: "distributed-caching",
    title: "Scaling Backend Architectures with Multi-Tier Distributed Caching",
    date: "FEB 24, 2024",
    excerpt: "How to effectively combine Redis, application-level caching, and CDNs to handle millions of concurrent users.",
    content: "Caching is often the first line of defense against high latency and database load. In this post, we explore a multi-tiered approach starting from the browser...",
    category: "Architecture",
    readTime: "8 min read"
  },
  {
    id: "typescript-patterns",
    slug: "typescript-patterns",
    title: "Advanced TypeScript Patterns for Large Scale React Applications",
    date: "JAN 15, 2024",
    excerpt: "Deep dive into conditional types, utility types, and generic component design to ensure absolute type safety.",
    content: "TypeScript is more than just interfaces and types. When working on large-scale applications, leverageing mapped types and template literal types can significantly reduce boilerplate...",
    category: "Web Development",
    readTime: "5 min read"
  }
];
