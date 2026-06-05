"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, MousePointerClick, TrendingUp, Users, Mail, Download, ArrowRight, UserCheck, Link2, Sparkles, Loader2, GitBranch } from "lucide-react";
import Link from "next/link";
import StatsCard from "../components/dashboard/StatsCard";
import DashboardCard from "../components/dashboard/DashboardCard";
import SectionHeader from "../components/dashboard/SectionHeader";
import Button from "../components/Button";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    views: 0,
    clicks: 0,
    ctr: "0%",
    linksCount: 0,
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        // 1. Fetch the user's active tree
        const { data: tree, error: treeError } = await supabase
          .from("trees")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (treeError) throw treeError;

        if (!tree) {
          // Redirect to onboarding setup wizard immediately
          router.push("/dashboard/blinko-tree/setup");
          return;
        }

        // 2. Fetch analytics
        const { data: analytics, error: analyticsError } = await supabase
          .from("analytics")
          .select("views, clicks")
          .eq("tree_id", tree.id)
          .maybeSingle();

        if (analyticsError && analyticsError.code !== "PGRST116") throw analyticsError;

        // 3. Fetch links count
        const { count: linksCount, error: linksError } = await supabase
          .from("links")
          .select("id", { count: "exact", head: true })
          .eq("tree_id", tree.id);

        if (linksError) throw linksError;

        const views = analytics?.views || 0;
        const clicks = analytics?.clicks || 0;
        const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) + "%" : "0%";

        setStats({
          views,
          clicks,
          ctr,
          linksCount: linksCount || 0,
        });

        // Generate real-time activities list
        const generatedActivities = [];
        if (views > 0) {
          generatedActivities.push({
            id: "act-1",
            user: "Visitor",
            action: "viewed your Blinko Tree",
            details: "Location: Verified view",
            time: "Recently",
            icon: Eye,
          });
        }
        if (clicks > 0) {
          generatedActivities.push({
            id: "act-2",
            user: "User interaction",
            action: "clicked one of your links",
            details: "Counted in CTR conversion",
            time: "Recently",
            icon: Link2,
          });
        }
        if (generatedActivities.length === 0) {
          generatedActivities.push({
            id: "act-empty",
            user: "System",
            action: "awaiting first tree view",
            details: "Share your page to gather analytics.",
            time: "Now",
            icon: Sparkles,
          });
        }
        setActivities(generatedActivities);

      } catch (err) {
        console.error("Dashboard Loading Error:", err.message || JSON.stringify(err) || err);
        console.warn("Hint: Make sure the Supabase database is initialized by running the SQL in schema.sql in the Supabase SQL editor.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-violet-500 mx-auto" />
          <p className="text-sm text-zinc-400">Verifying tree setup status...</p>
        </div>
      </div>
    );
  }

  // Render stats cards
  const statsList = [
    { id: "views", label: "Total Views", value: stats.views.toLocaleString(), change: "+0%", isPositive: true, timeframe: "All time", icon: Eye },
    { id: "clicks", label: "Total Clicks", value: stats.clicks.toLocaleString(), change: "+0%", isPositive: true, timeframe: "All time", icon: MousePointerClick },
    { id: "ctr", label: "Click-Through Rate", value: stats.ctr, change: "0%", isPositive: true, timeframe: "Conversion", icon: TrendingUp },
    { id: "links", label: "Links Count", value: stats.linksCount.toString(), change: "Active", isPositive: true, timeframe: "Live items", icon: Link2 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Welcome back, {profile?.display_name || user?.email?.split("@")[0] || "Creator"} 👋
          </h1>
          <p className="mt-2 text-sm text-zinc-400 md:text-base">
            Your Blinko Tree is fully initialized. Live data is loading directly from your database.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/dashboard/tree"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-violet-950/20 hover:from-violet-500 hover:to-fuchsia-400 transition"
            >
              <GitBranch className="h-3.5 w-3.5" />
              Customize Tree
            </Link>
            <Link
              href="/dashboard/analytics"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900 transition"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsList.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="rounded-xl border border-zinc-900 bg-zinc-950 p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">{stat.label}</span>
                <span className="rounded-lg bg-zinc-900 border border-zinc-850 p-1.5 text-violet-400">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-semibold text-white tracking-tight">{stat.value}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] rounded bg-emerald-500/10 px-1.5 py-0.2 font-semibold text-emerald-400">
                    {stat.change}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-medium">
                    {stat.timeframe}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphs & Charts & Activities */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Analytics Graph */}
        <DashboardCard className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Performance Overview</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Real-time interactions over the past week</p>
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
            <div className="flex justify-between text-[10px] text-zinc-650 mt-2 font-mono">
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
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex gap-3 text-xs leading-relaxed group">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 group-hover:border-violet-500/30 group-hover:text-violet-400 transition-colors">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-200">
                      <span className="text-white">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-[10px] text-zinc-550 mt-0.5">{activity.details}</p>
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
        <Link href="/dashboard/tree" className="group">
          <DashboardCard hoverEffect className="flex items-center justify-between border-dashed p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-zinc-900 p-2.5 text-zinc-400 group-hover:bg-violet-600/10 group-hover:text-violet-400 transition-colors">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Blinko Tree Settings</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Bio, template & social connections</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-white transition-colors" />
          </DashboardCard>
        </Link>

        <Link href="/dashboard/tree?tab=links" className="group">
          <DashboardCard hoverEffect className="flex items-center justify-between border-dashed p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-zinc-900 p-2.5 text-zinc-400 group-hover:bg-violet-600/10 group-hover:text-violet-400 transition-colors">
                <Link2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Configure Links</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Insert custom links & track clicks</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-white transition-colors" />
          </DashboardCard>
        </Link>

        <Link href="/dashboard/tree?tab=design" className="group">
          <DashboardCard hoverEffect className="flex items-center justify-between border-dashed p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-zinc-900 p-2.5 text-zinc-400 group-hover:bg-violet-600/10 group-hover:text-violet-400 transition-colors">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Design & Themes</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Modify styles & layout palettes</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-white transition-colors" />
          </DashboardCard>
        </Link>
      </div>
    </div>
  );
}
