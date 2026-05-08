import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Production-grade safety: only initialize with real data or non-crashing placeholders
export const supabase = createClient(
  supabaseUrl.startsWith("http")
    ? supabaseUrl
    : "https://fvuikdbaheghakxhsnuy.supabase.co",
  supabaseAnonKey.length > 20
    ? supabaseAnonKey
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder",
);

// Debug logging for production troubleshooting
if (import.meta.env.DEV) {
  console.log("Supabase Config:", {
    url: supabaseUrl ? "✓ Set" : "✗ Missing",
    key: supabaseAnonKey ? "✓ Set" : "✗ Missing",
    keyLength: supabaseAnonKey.length,
  });
}

// Test the client initialization
if (import.meta.env.DEV) {
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error("Supabase client test failed:", error);
    } else {
      console.log("Supabase client initialized successfully");
    }
  });
}

// Production error handling
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase configuration missing. Please check environment variables.",
  );
}

// Helper types for your database tables (you can expand these as you define your schema)
export type Tables = {
  profile: {
    id: string;
    name: string;
    role: string;
    location: string;
    email: string;
    github: string;
    linkedin: string;
    birth_year: number;
    resume_url: string;
    summary: string;
    updated_at: string;
  };
  projects: {
    id: string;
    title: string;
    description: string[];
    tech: string[];
    link?: string;
    demo_url?: string;
    order_index: number;
    created_at: string;
  };
  experience: {
    id: string;
    role: string;
    company: string;
    location: string;
    period: string;
    highlights: string[];
    order_index: number;
    created_at: string;
  };
  blogs: {
    id: string;
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
    category: string;
    read_time: string;
    published?: boolean;
    created_at: string;
  };
};
