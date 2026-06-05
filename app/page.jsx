import {
  ArrowRight,
  BarChart3,
  Bot,
  Contact,
  Globe2,
  LayoutTemplate,
  Link2,
  Sparkles,
} from "lucide-react";
import BlinkoLogo from "./components/BlinkoLogo";
import Button from "./components/Button";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

const features = [
  {
    icon: Bot,
    title: "AI-first setup",
    copy: "Describe your style, audience, and goals. Blinko drafts the page structure for you.",
  },
  {
    icon: LayoutTemplate,
    title: "Premium templates",
    copy: "Start from modern layouts built for creators, students, freelancers, and businesses.",
  },
  {
    icon: BarChart3,
    title: "Growth signals",
    copy: "See which links, posts, and contact paths are getting attention.",
  },
];

const profileLinks = ["blinko.site/lenny", "blinko.site/creator"];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main>
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.26),transparent_36%)]" />
          <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.86fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm text-violet-200">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                One prompt to a complete online presence
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                Build Your Online Presence in 30 Seconds
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
                Blinko uses AI to create your perfect link-in-bio page,
                portfolio, contact hub, and mini website-all from a single
                prompt.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/signup" size="lg" icon={ArrowRight}>
                  Get Started Free
                </Button>
                <Button href="/templates" size="lg" variant="secondary">
                  Browse Templates
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {profileLinks.map((profile) => (
                  <span
                    key={profile}
                    className="rounded-md border border-[#222222] bg-[#111111] px-3 py-2 text-sm text-zinc-400"
                  >
                    {profile}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#222222] bg-[#111111] p-4 shadow-2xl shadow-violet-950/20">
              <div className="rounded-lg border border-white/10 bg-black/30 p-5">
                <div className="flex items-center justify-between">
                  <BlinkoLogo href={null} />
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                    Live
                  </span>
                </div>
                <div className="mt-8">
                  <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500" />
                  <h2 className="mt-5 text-2xl font-semibold">
                    Blinko Creator
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    AI tools, portfolio highlights, contact links, and latest
                    work in one polished page.
                  </p>
                </div>
                <div className="mt-6 grid gap-3">
                  {[
                    ["Portfolio", Globe2],
                    ["Book a call", Contact],
                    ["Latest links", Link2],
                  ].map(([label, Icon]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.03] p-3"
                    >
                      <span className="flex items-center gap-3 text-sm text-zinc-200">
                        <Icon
                          className="h-4 w-4 text-violet-300"
                          aria-hidden="true"
                        />
                        {label}
                      </span>
                      <ArrowRight
                        className="h-4 w-4 text-zinc-500"
                        aria-hidden="true"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="border-y border-white/[0.06] bg-white/[0.02] px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, copy }) => (
              <div
                key={title}
                className="rounded-lg border border-[#222222] bg-[#111111] p-5 transition duration-200 hover:-translate-y-1 hover:border-violet-500/50 hover:bg-white/[0.03]"
              >
                <Icon className="h-5 w-5 text-violet-300" aria-hidden="true" />
                <h3 className="mt-4 text-base font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{copy}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
