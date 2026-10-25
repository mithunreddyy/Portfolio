import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { FormEvent, useState } from "react";
import { PERSONAL_INFO } from "../constants";


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
      // Get the key from env, or use a placeholder to trigger the developer warning
      const web3FormsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "YOUR_WEB3FORMS_ACCESS_KEY";
      
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          name: formState.name,
          email: formState.email,
          message: formState.message,
          subject: `New Portfolio Contact from ${formState.name}`,
          from_name: "Portfolio Contact Form",
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
         if (web3FormsKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
           throw new Error("Email service not configured. Add VITE_WEB3FORMS_ACCESS_KEY to .env");
         }
         throw new Error(result.message || "Failed to deliver email");
      }

      setStatus("success");
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      console.error("Error delivering message:", err);
      setStatus("error");
      setErrorMessage(
        err.message?.includes("VITE_WEB3FORMS_ACCESS_KEY") 
          ? err.message 
          : "Failed to deliver message. Please try again."
      );
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
      className="section-container pt-3 sm:pt-4 pb-20 sm:pb-16 bg-bg text-muted"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-7 mb-5 sm:mb-6">
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            aria-label={`${social.label}: ${social.value}`}
            {...(social.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noreferrer" })}
            className="group inline-flex items-center gap-1.5 min-h-[44px] text-[18px] sm:text-[18px] text-muted hover:text-ink transition-colors"
          >
            {social.label.toLowerCase()}
            <ArrowUpRight
              size={18}
              strokeWidth={1.75}
              aria-hidden="true"
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        ))}
      </div>
    </footer>
  );
}
