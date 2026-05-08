import { createClient } from "@supabase/supabase-js";

// ─── Production URL Resolution ─────────────────────────────────────────────
// NEVER rely on window.location.origin alone — it returns localhost during dev
// and can be spoofed. Always prefer the explicit env var.
export const PRODUCTION_URL =
  import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") ||
  (import.meta.env.PROD
    ? "https://mithunr.vercel.app"
    : "http://localhost:5173");

// ─── Supabase Client ────────────────────────────────────────────────────────
const supabaseUrl =
  import.meta.env.VITE_PUBLIC_SUPABASE_URL ||
  "https://fvuikdbaheghakxhsnuy.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2dWlrZGJhaGVnaGFreGhzbnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNTYzOTAsImV4cCI6MjA5MzYzMjM5MH0.ytMdGqQwB3dNfDqB0Z0Qn1cDDx_BdpIjhsH_V1usPq0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // PKCE flow: tokens arrive as ?code= query param (not URL hash).
    // This is essential for SPA magic links to work correctly in production.
    // The /auth/callback route exchanges the code for a real session.
    flowType: "pkce",

    // Persist session in localStorage across page reloads
    persistSession: true,

    // Auto-refresh the JWT before it expires
    autoRefreshToken: true,

    // Let Supabase detect the session from URL on every page load
    detectSessionInUrl: true,

    // Namespaced storage key to avoid collisions with other apps
    storageKey: "portfolio-cms-auth-v1",
  },
});

// ─── Dev Diagnostics ────────────────────────────────────────────────────────
if (import.meta.env.DEV) {
  console.group("[Supabase] Config");
  console.log("URL:", supabaseUrl ? "✓ Set" : "✗ Missing");
  console.log("Key:", supabaseAnonKey?.length > 20 ? "✓ Set" : "✗ Missing");
  console.log("Flow:", "pkce");
  console.log("Production URL:", PRODUCTION_URL);
  console.groupEnd();
}

// ─── Types ──────────────────────────────────────────────────────────────────
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
