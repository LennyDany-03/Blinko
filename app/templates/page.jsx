import { Filter, Search, Sparkles } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import TemplateCard from "../components/TemplateCard";

export const metadata = {
  title: "Templates | Blinko",
  description:
    "Choose a beautiful Blinko template for creators, students, freelancers, and businesses.",
};

const categories = ["All", "Creators", "Portfolio", "Business", "Student"];

const templates = [
  {
    name: "Minimal",
    description: "A crisp one-page presence for clean bios and focused links.",
    gradient: "bg-gradient-to-br from-zinc-900 via-zinc-800 to-violet-950",
    accent: "bg-violet-300",
    stats: ["bio", "links", "mail"],
  },
  {
    name: "Creator",
    description: "Designed for launches, latest posts, communities, and offers.",
    gradient: "bg-gradient-to-br from-fuchsia-950 via-violet-950 to-zinc-950",
    accent: "bg-fuchsia-300",
    stats: ["feed", "shop", "club"],
  },
  {
    name: "Developer",
    description: "Show projects, GitHub highlights, writing, and availability.",
    gradient: "bg-gradient-to-br from-cyan-950 via-zinc-900 to-violet-950",
    accent: "bg-cyan-300",
    stats: ["code", "work", "docs"],
  },
  {
    name: "Artist",
    description: "A visual-first canvas for galleries, drops, and commissions.",
    gradient: "bg-gradient-to-br from-rose-950 via-zinc-900 to-violet-950",
    accent: "bg-rose-300",
    stats: ["art", "drops", "book"],
  },
  {
    name: "Startup",
    description: "A mini site for waitlists, investor links, and product updates.",
    gradient: "bg-gradient-to-br from-emerald-950 via-zinc-900 to-violet-950",
    accent: "bg-emerald-300",
    stats: ["beta", "road", "team"],
  },
  {
    name: "Dark Pro",
    description: "A premium dark profile with analytics-ready content blocks.",
    gradient: "bg-gradient-to-br from-black via-violet-950 to-zinc-900",
    accent: "bg-violet-300",
    stats: ["pro", "data", "site"],
  },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main>
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
          <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.22),transparent_36%)]" />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm text-violet-200">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              AI-ready templates
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">
              Choose Your Template
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              Beautiful designs for creators, students, freelancers, and
              businesses.
            </p>
          </div>
        </section>

        <section className="px-4 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 rounded-lg border border-[#222222] bg-[#111111] p-4 md:flex-row md:items-center md:justify-between">
            <label className="flex h-11 flex-1 items-center gap-3 rounded-md border border-[#222222] bg-black/30 px-3 transition focus-within:border-violet-500/70">
              <Search className="h-4 w-4 text-zinc-500" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search templates"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-9 items-center gap-2 rounded-md border border-[#222222] px-3 text-sm text-zinc-400">
                <Filter className="h-4 w-4" aria-hidden="true" />
                Filter
              </span>
              {categories.map((category, index) => (
                <button
                  key={category}
                  type="button"
                  className={[
                    "h-9 rounded-md border px-3 text-sm font-medium transition duration-200 hover:-translate-y-0.5",
                    index === 0
                      ? "border-violet-500/50 bg-violet-500/15 text-violet-100"
                      : "border-[#222222] bg-white/[0.03] text-zinc-400 hover:border-violet-500/50 hover:bg-white/[0.08] hover:text-white",
                  ].join(" ")}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <TemplateCard key={template.name} {...template} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
