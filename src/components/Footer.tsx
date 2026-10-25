import { ArrowUpRight } from "lucide-react";
import { PERSONAL_INFO } from "../constants";

export function Footer() {
  const { email, github, linkedin } = PERSONAL_INFO;

  const socials = [
    { label: "Email", value: email, href: `mailto:${email}` },
    github && { label: "GitHub", value: `@${github}`, href: `https://github.com/${github}` },
    linkedin && { label: "LinkedIn", value: `/in/${linkedin}`, href: `https://linkedin.com/in/${linkedin}` },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <footer
      id="contact"
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
