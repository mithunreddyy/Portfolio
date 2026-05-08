import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type AuthState = "exchanging" | "success" | "error";

/**
 * AuthCallback — handles the Supabase PKCE magic link redirect.
 *
 * After the user clicks the magic link in their email, Supabase redirects them
 * to <siteUrl>/auth/callback?code=<pkce_code>. This component:
 *   1. Detects the ?code= query param
 *   2. Calls supabase.auth.exchangeCodeForSession() to get a real session
 *   3. Stores the session and redirects to /cms
 *
 * Without this route, magic links fail silently — the token is lost when the
 * SPA router tries to handle a hash/param it wasn't designed to intercept.
 */
export function AuthCallback() {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>("exchanging");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const exchanged = useRef(false); // prevent React strict-mode double-fire

  useEffect(() => {
    if (exchanged.current) return;
    exchanged.current = true;

    const handleCallback = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");
        const errorDescription = url.searchParams.get("error_description");

        // Supabase may pass an error directly in the URL
        if (error) {
          throw new Error(
            errorDescription || error || "Authentication error from provider."
          );
        }

        if (!code) {
          // No PKCE code — check if there's already an active session
          // (e.g. user navigated here directly or refreshed mid-flow)
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setState("success");
            setTimeout(() => navigate("/cms", { replace: true }), 800);
            return;
          }
          throw new Error(
            "No authorization code found. The magic link may be expired or invalid."
          );
        }

        // Exchange the PKCE code for a real session token
        const { data, error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) throw exchangeError;
        if (!data.session) throw new Error("Session exchange returned empty.");

        setState("success");

        // Clean the code from the URL bar before redirecting
        window.history.replaceState({}, "", "/auth/callback");
        setTimeout(() => navigate("/cms", { replace: true }), 900);
      } catch (err: any) {
        console.error("[AuthCallback] Exchange failed:", err);
        setErrorMsg(
          err.message || "Authentication failed. Please request a new link."
        );
        setState("error");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6 text-center max-w-sm"
      >
        {state === "exchanging" && (
          <>
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
              <div className="absolute inset-0 border-2 border-t-white/60 rounded-full animate-spin" />
            </div>
            <div>
              <p className="text-white font-bold text-lg mb-1">
                Authenticating
              </p>
              <p className="text-white/30 text-sm">
                Exchanging authorization code…
              </p>
            </div>
          </>
        )}

        {state === "success" && (
          <>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-emerald-400"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
            <div>
              <p className="text-white font-bold text-lg mb-1">Access Granted</p>
              <p className="text-white/30 text-sm">Redirecting to admin…</p>
            </div>
          </>
        )}

        {state === "error" && (
          <>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-red-400"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.div>
            <div>
              <p className="text-white font-bold text-lg mb-2">Auth Failed</p>
              <p className="text-red-400/80 text-sm leading-relaxed">
                {errorMsg}
              </p>
            </div>
            <button
              onClick={() => navigate("/cms", { replace: true })}
              className="mt-2 px-6 py-3 bg-white text-black font-bold rounded-xl text-sm hover:bg-white/90 transition-all"
            >
              Back to Login
            </button>
          </>
        )}
      </motion.div>

      {/* Ambient gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl" />
      </div>
    </div>
  );
}
