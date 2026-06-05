"use client";

import { Eye, MousePointerClick, TrendingUp, Users, Mail, Download, ArrowRight, UserCheck, Link2, Sparkles } from "lucide-react";
import { Github, Linkedin } from "../components/dashboard/BrandIcons";
import Link from "next/link";
import { MOCK_STATS, MOCK_ACTIVITIES } from "../constants/dashboardData";
import StatsCard from "../components/dashboard/StatsCard";
import DashboardCard from "../components/dashboard/DashboardCard";
import SectionHeader from "../components/dashboard/SectionHeader";
import Button from "../components/Button";

import { useAuth } from "../../context/AuthContext";

// Map activity icon names to Lucide icons
const activityIconMap = {
  Github,
  Eye,
  Mail,
  Download,
  Linkedin,
};

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const isIncomplete = profile && (!profile.bio || !profile.location || !profile.website);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Profile Incomplete Banner */}
      {isIncomplete && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-violet-500/20 bg-violet-600/5 px-4 py-3 text-xs text-zinc-350">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400 animate-pulse shrink-0" />
            <span>Complete your profile: add a biography, location, and website link to optimize your page.</span>
          </div>
          <Link href="/dashboard/profile" className="font-semibold text-violet-300 hover:text-violet-200 hover:underline shrink-0">
            Complete Profile &rarr;
          </Link>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Welcome back, {profile?.display_name || user?.email?.split("@")[0] || "Creator"} 👋
          </h1>
          <p className="mt-2 text-sm text-zinc-400 md:text-base">
            Your online presence is growing. You gained <span className="font-semibold text-violet-400">+12% more views</span> this week.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/dashboard/ai-builder"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-violet-950/20 hover:from-violet-500 hover:to-fuchsia-400 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Build with AI
            </Link>
            <Link
              href="/dashboard/links"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900 transition"
            >
              <Link2 className="h-3.5 w-3.5" />
              Manage Links
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_STATS.map((stat) => (
          <StatsCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            timeframe={stat.timeframe}
            iconName={stat.iconName}
          />
        ))}
      </div>

      {/* Graphs & Charts & Activities */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Fake Analytics Graph */}
        <DashboardCard className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Performance</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Analytics clicks vs views over the past week</p>
              </div>
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                  Views
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Clicks
                </span>
              </div>
            </div>

            {/* Glowing Chart SVG Container */}
            <div className="mt-8 relative h-48 w-full">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="5" x2="100" y2="5" stroke="#222" strokeWidth="0.1" strokeDasharray="1" />
                <line x1="0" y1="15" x2="100" y2="15" stroke="#222" strokeWidth="0.1" strokeDasharray="1" />
                <line x1="0" y1="25" x2="100" y2="25" stroke="#222" strokeWidth="0.1" strokeDasharray="1" />

                {/* Views Area Fill */}
                <path
                  d="M 0 25 Q 15 15, 30 18 T 60 8 T 85 14 T 100 4 L 100 30 L 0 30 Z"
                  fill="url(#viewsGrad)"
                />
                {/* Views Stroke */}
                <path
                  d="M 0 25 Q 15 15, 30 18 T 60 8 T 85 14 T 100 4"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="0.65"
                  strokeLinecap="round"
                />

                {/* Clicks Area Fill */}
                <path
                  d="M 0 28 Q 15 22, 30 24 T 60 16 T 85 22 T 100 12 L 100 30 L 0 30 Z"
                  fill="url(#clicksGrad)"
                />
                {/* Clicks Stroke */}
                <path
                  d="M 0 28 Q 15 22, 30 24 T 60 16 T 85 22 T 100 12"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="0.65"
                  strokeLinecap="round"
                />
              </svg>

              {/* Glowing Dots */}
              <span className="absolute top-[13%] right-0 h-2 w-2 -translate-x-1/2 rounded-full border-2 border-zinc-950 bg-violet-400 shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
              <span className="absolute top-[40%] right-0 h-2 w-2 -translate-x-1/2 rounded-full border-2 border-zinc-950 bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </div>

            {/* X-axis indicators */}
            <div className="flex justify-between text-[10px] text-zinc-600 mt-2 font-mono">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </DashboardCard>

        {/* Recent Activity Panel */}
        <DashboardCard>
          <h3 className="text-base font-semibold text-white">Recent Activity</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Live interactions on your page</p>

          <div className="mt-6 space-y-4">
            {MOCK_ACTIVITIES.map((activity) => {
              const Icon = activityIconMap[activity.iconName] || Eye;
              return (
                <div key={activity.id} className="flex gap-3 text-xs leading-relaxed group">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 group-hover:border-violet-500/30 group-hover:text-violet-400 transition-colors">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-200">
                      <span className="text-white">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{activity.details}</p>
                  </div>
                  <span className="text-[10px] text-zinc-600 shrink-0">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </DashboardCard>
      </div>

      {/* Quick Actions Panel */}
      <div className="grid gap-5 sm:grid-cols-3">
        <Link href="/dashboard/profile" className="group">
          <DashboardCard hoverEffect className="flex items-center justify-between border-dashed p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-zinc-900 p-2.5 text-zinc-400 group-hover:bg-violet-600/10 group-hover:text-violet-400 transition-colors">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Edit Profile</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Bio, photo & social connections</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-white transition-colors" />
          </DashboardCard>
        </Link>

        <Link href="/dashboard/links" className="group">
          <DashboardCard hoverEffect className="flex items-center justify-between border-dashed p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-zinc-900 p-2.5 text-zinc-400 group-hover:bg-violet-600/10 group-hover:text-violet-400 transition-colors">
                <Link2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Add Link</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Insert custom links & track clicks</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-white transition-colors" />
          </DashboardCard>
        </Link>

        <Link href="/dashboard/ai-builder" className="group">
          <DashboardCard hoverEffect className="flex items-center justify-between border-dashed p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-zinc-900 p-2.5 text-zinc-400 group-hover:bg-violet-600/10 group-hover:text-violet-400 transition-colors">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Generate AI Layout</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Rebuild sections from prompt</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-white transition-colors" />
          </DashboardCard>
        </Link>
      </div>
    </div>
  );
}
