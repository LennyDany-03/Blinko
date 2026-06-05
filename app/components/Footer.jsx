import { Briefcase, Camera, Code2, MessageCircle } from "lucide-react";
import BlinkoLogo from "./BlinkoLogo";

const groups = [
  {
    title: "Product",
    links: ["Templates", "Analytics", "AI Builder", "Custom Domain"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Customers", "Contact"],
  },
  {
    title: "Resources",
    links: ["Docs", "Guides", "Changelog", "Status"],
  },
];

const socials = [
  { label: "Updates", icon: MessageCircle },
  { label: "Gallery", icon: Camera },
  { label: "Code", icon: Code2 },
  { label: "Company", icon: Briefcase },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0A0A0A]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <BlinkoLogo />
          <p className="mt-4 text-sm font-medium text-white">
            One Link. Endless Possibilities.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-400">
            AI-powered link-in-bio pages and mini websites for creators,
            founders, and modern teams.
          </p>
          <div className="mt-6 flex items-center gap-2">
            {socials.map(({ label, icon: Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:border-violet-500/50 hover:bg-white/[0.08] hover:text-white"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-white">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-zinc-400 transition hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/[0.06] px-4 py-5 text-center text-xs text-zinc-500">
        © 2026 Blinko
      </div>
    </footer>
  );
}
