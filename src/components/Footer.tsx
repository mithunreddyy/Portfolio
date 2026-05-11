import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FormEvent, useState } from "react";
import { PERSONAL_INFO } from "../constants";
import { supabase } from "../lib/supabase";

export function Footer() {
  const personalInfo = PERSONAL_INFO;
  const currentYear = new Date().getFullYear();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!formState.name.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!validateEmail(formState.email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!formState.message.trim()) {
      setStatus("error");
      setErrorMessage("Please enter a message.");
      return;
    }

    try {
      const { error } = await supabase.from('messages').insert([
        {
          name: formState.name,
          email: formState.email,
          message: formState.message,
          created_at: new Date().toISOString()
        }
      ]);

      if (error) throw error;

      setStatus("success");
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      console.error("Error sending message:", err);
      setStatus("error");
      setErrorMessage("Failed to send message. Please try again.");
    }
  };

  const socials = [
    {
      label: "Email",
      value: personalInfo.email,
      icon: <Mail size={16} />,
      href: `mailto:${personalInfo.email}`,
    },
    {
      label: "GitHub",
      value: personalInfo.github ? `@${personalInfo.github}` : "@username",
      icon: <Github size={16} />,
      href: personalInfo.github
        ? `https://github.com/${personalInfo.github}`
        : "#",
    },
    {
      label: "LinkedIn",
      value: personalInfo.linkedin
        ? `/in/${personalInfo.linkedin}`
        : "/in/username",
      icon: <Linkedin size={16} />,
      href: personalInfo.linkedin
        ? `https://linkedin.com/in/${personalInfo.linkedin}`
        : "#",
    },
  ].filter((social) => social.href !== "#");

  return (
    <footer
      id="contact"
      className="section-container pt-3 sm:pt-4 pb-20 sm:pb-16 bg-bg text-muted"
    >
      <h2 className="text-[15px] sm:text-[17px] font-semibold text-ink mb-2">
        Contact
      </h2>
      <p className="text-[16px] sm:text-[18px] leading-[1.75] text-muted/70 font-medium mb-3 sm:mb-4 max-w-xl">
        You can contact me using the form or via the links below.
      </p>

      <form className="space-y-2.5 mb-5 sm:mb-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Name"
            value={formState.name}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
            className="w-full bg-transparent border border-ink/[0.08] rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-ink/20 transition-all placeholder:text-muted/25 text-[14px] font-medium"
          />
          <input
            type="email"
            placeholder="Email"
            value={formState.email}
            onChange={(e) =>
              setFormState({ ...formState, email: e.target.value })
            }
            className="w-full bg-transparent border border-ink/[0.08] rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-ink/20 transition-all placeholder:text-muted/25 text-[14px] font-medium"
          />
        </div>
        <textarea
          placeholder="Message"
          rows={5}
          value={formState.message}
          onChange={(e) =>
            setFormState({ ...formState, message: e.target.value })
          }
          className="w-full bg-transparent border border-ink/[0.08] rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-ink/20 transition-all placeholder:text-muted/25 text-[14px] font-medium resize-y"
        />

        <AnimatePresence mode="wait">
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[11px] font-bold text-red-500 uppercase tracking-widest font-mono"
            >
              {errorMessage}
            </motion.p>
          )}
          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[11px] font-bold text-accent uppercase tracking-widest font-mono"
            >
              Message sent successfully!
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between pt-1">
          <button
            type="submit"
            className="h-10 px-6 bg-ink text-bg hover:scale-[1.02] active:scale-[0.98] rounded-lg text-[13px] sm:text-[14px] font-medium transition-all flex items-center gap-2"
          >
            Send message
          </button>
          <div className="hidden sm:flex items-center gap-2 text-[12px] text-muted/35 font-medium">
            <span>or</span>
            <span className="text-sm leading-none">↵</span>
            <span className="font-mono uppercase tracking-tight">
              Enter to send
            </span>
          </div>
        </div>
      </form>

      {/* Social Links */}
      <div className="mb-5 sm:mb-6">
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            className="flex items-center justify-between py-2.5 sm:py-3 group transition-all active:bg-ink/[0.02] -mx-2 px-2 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-muted/65 group-hover:text-ink transition-colors">
                {social.icon}
              </span>
              <span className="text-[16px] sm:text-[18px] font-medium text-muted/70 group-hover:text-ink transition-colors">
                {social.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] sm:text-[15px] text-muted/65 font-medium group-hover:text-ink transition-colors tracking-tight truncate max-w-[180px] sm:max-w-none">
                {social.value}
              </span>
              <ArrowUpRight
                size={14}
                className="text-muted/60 group-hover:text-ink transition-all shrink-0"
              />
            </div>
          </a>
        ))}
      </div>

      {/* Footer meta */}
      <div className="flex flex-row sm:flex-row justify-between items-start sm:items-center gap-2.5 text-[14px] sm:text-[16px] font-medium text-muted/65">
        <div className="flex items-center gap-1">
          <MapPin size={16} className="opacity-85" />
          <span>Hyderabad, India</span>
        </div>
        <span>© {currentYear} Mithun Reddy</span>
      </div>
    </footer>
  );
}
