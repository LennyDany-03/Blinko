"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle,
  LayoutGrid,
  Palette,
  Eye,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { MOCK_AI_SUGGESTIONS } from "../../constants/dashboardData";
import SectionHeader from "../../components/dashboard/SectionHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Button from "../../components/Button";

const samplePrompts = [
  {
    text: "I'm a computer science student looking for frontend internships.",
    key: "student",
    label: "🎓 CS Student",
  },
  {
    text: "I'm a freelance product designer sharing branding & Webflow work.",
    key: "designer",
    label: "🎨 Product Designer",
  },
  {
    text: "I'm a YouTuber sharing web dev tutorials and streaming setups.",
    key: "youtuber",
    label: "📹 Dev YouTuber",
  },
];

export default function AiBuilderPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryPrompt = params.get("prompt");
      if (queryPrompt) {
        setPrompt(queryPrompt);
        localStorage.removeItem("blinko_pending_prompt");
        const newUrl = window.location.pathname;
        window.history.replaceState({ path: newUrl }, "", newUrl);
      } else {
        const storedPrompt = localStorage.getItem("blinko_pending_prompt");
        if (storedPrompt) {
          setPrompt(storedPrompt);
          localStorage.removeItem("blinko_pending_prompt");
        }
      }
    }
  }, []);

  const handleSelectSample = (sample) => {
    setPrompt(sample.text);
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResult(null);
    setLoadingStep(0);

    // Simulate multi-step compilation process
    const stepMessages = [
      "Analyzing prompt semantics...",
      "Matching industry aesthetics...",
      "Drafting card layouts...",
      "Finalizing responsive block schemas...",
    ];

    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= stepMessages.length - 1) {
          clearInterval(interval);
          // Determine which suggestion profile fits best
          const lowercasePrompt = prompt.toLowerCase();
          let matchedKey = "student"; // Default fallback
          if (lowercasePrompt.includes("design") || lowercasePrompt.includes("portfolio")) {
            matchedKey = "designer";
          } else if (
            lowercasePrompt.includes("youtube") ||
            lowercasePrompt.includes("video") ||
            lowercasePrompt.includes("setup")
          ) {
            matchedKey = "youtuber";
          }

          setResult(MOCK_AI_SUGGESTIONS[matchedKey]);
          setLoading(false);
          return 0;
        }
        return prev + 1;
      });
    }, 700);
  };

  const stepMessages = [
    "Analyzing prompt semantics...",
    "Matching industry aesthetics & design theme...",
    "Drafting card layouts & sections...",
    "Finalizing responsive block schemas...",
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <SectionHeader
        title="AI Page Builder"
        description="Describe yourself or your project, and Blinko's AI will draft a high-converting layout structure instantly."
      />

      {/* Hero prompt input card */}
      <DashboardCard className="border-violet-500/20 bg-zinc-950/60" gradientBorder>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="rounded-lg bg-violet-600/10 p-2 text-violet-400">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Build your page with AI</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Describe your goal, tone, and audience.</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="relative">
            <textarea
              placeholder="Describe yourself (e.g. 'I'm a freelance developer showcasing React apps and offering consulting sessions'...)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows="3"
              disabled={loading}
              className="w-full rounded-xl border border-zinc-900 bg-zinc-900/20 p-4 pr-12 text-sm text-zinc-200 placeholder-zinc-650 outline-none transition focus:border-violet-500/50 focus:bg-zinc-900/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow hover:from-violet-500 hover:to-fuchsia-400 transition disabled:pointer-events-none disabled:opacity-40"
              aria-label="Generate layout"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Examples Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500 mr-1">Suggestions:</span>
            {samplePrompts.map((sample) => (
              <button
                key={sample.key}
                type="button"
                disabled={loading}
                onClick={() => handleSelectSample(sample)}
                className={[
                  "rounded-full border border-zinc-900 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-400 hover:border-violet-500/30 hover:bg-violet-950/10 hover:text-violet-300 transition",
                  prompt === sample.text ? "border-violet-500/40 bg-violet-950/20 text-violet-300" : "",
                ].join(" ")}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </form>
      </DashboardCard>

      {/* Loading Skeleton */}
      {loading && (
        <DashboardCard className="flex flex-col items-center justify-center p-12 space-y-4 border-dashed border-zinc-800 bg-zinc-950/40 min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
          <div className="text-center space-y-1">
            <h4 className="text-sm font-semibold text-white">Generating Page Draft</h4>
            <p className="text-xs text-violet-400 animate-pulse font-mono">
              {stepMessages[loadingStep]}
            </p>
          </div>

          {/* Dummy visual blocks simulating construction */}
          <div className="w-full max-w-sm space-y-2 mt-4 opacity-30">
            <div className="h-6 bg-zinc-800 rounded-md animate-pulse w-3/4 mx-auto" />
            <div className="h-10 bg-zinc-800 rounded-md animate-pulse" />
            <div className="h-10 bg-zinc-800 rounded-md animate-pulse" />
          </div>
        </DashboardCard>
      )}

      {/* Suggested layout results section */}
      {result && !loading && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                AI Recommendation Ready!
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Here is the customized visual structure draft for your site.</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPrompt("") || setResult(null)}
                className="text-xs text-zinc-400 hover:text-white"
                icon={RefreshCw}
              >
                Reset AI
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="text-xs"
                onClick={() => alert("Success: AI layout applied to dashboard visual preview.")}
                icon={Sparkles}
              >
                Apply Layout Draft
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Theme & Layout Specifications */}
            <DashboardCard className="space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Visual Parameters</h4>
              
              <div className="space-y-4">
                {/* Theme Suggested */}
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <span className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                    <Palette className="h-4 w-4 text-violet-400" />
                    Visual Theme
                  </span>
                  <span className="rounded bg-violet-500/10 px-2 py-0.5 text-xs text-violet-300 border border-violet-500/20 font-medium">
                    {result.theme}
                  </span>
                </div>

                {/* Layout Suggested */}
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <span className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 text-violet-400" />
                    Block Hierarchy
                  </span>
                  <span className="rounded bg-zinc-900 px-2 py-0.5 text-xs text-zinc-400 border border-zinc-800 font-medium">
                    {result.layout}
                  </span>
                </div>

                {/* Alignment */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-violet-400" />
                    Style Settings
                  </span>
                  <span className="text-xs text-zinc-500">Center align, round corners</span>
                </div>
              </div>
            </DashboardCard>

            {/* Suggested Structure Cards */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Suggested Sections</h4>
              
              {result.sections.map((section, idx) => (
                <div
                  key={section.id}
                  className="flex items-start gap-4 rounded-xl border border-zinc-900 bg-zinc-950 p-4 hover:border-violet-500/25 transition duration-300 group"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 font-mono text-xs font-bold group-hover:bg-violet-600/10 group-hover:text-violet-400 transition-colors">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-semibold text-white">{section.title}</h5>
                      <span className="rounded-full bg-zinc-900 px-2 py-0.2 text-[9px] text-zinc-500 font-mono uppercase tracking-wider border border-zinc-850">
                        {section.type}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">{section.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
