"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, MousePointerClick, TrendingUp, Users, Mail, Download, ArrowRight, UserCheck, Link2, Sparkles, Loader2, GitBranch, Plus } from "lucide-react";
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
  const [hasNoTree, setHasNoTree] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pendingPrompt = localStorage.getItem("blinko_pending_prompt");
      if (pendingPrompt) {
        router.push(`/dashboard/ai-builder?prompt=${encodeURIComponent(pendingPrompt)}`);
        return;
      }
    }
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        // 1. Fetch the user's active tree
        const { data: userTrees, error: treeError } = await supabase
          .from("trees")
          .select("id")
          .eq("user_id", user.id)
          .order("is_active", { ascending: false })
          .order("created_at", { ascending: true })
          .limit(1);

        if (treeError) throw treeError;

        const tree = userTrees && userTrees.length > 0 ? userTrees[0] : null;

        if (!tree) {
          setHasNoTree(true);
          setLoading(false);
          return;
        }

        // 2. Fetch analytics
        const { data: analyticsRows, error: analyticsError } = await supabase
          .from("analytics")
          .select("views, clicks")
          .eq("tree_id", tree.id);

        if (analyticsError) throw analyticsError;

        let views = 0;
        let clicks = 0;
        if (analyticsRows && analyticsRows.length > 0) {
          views = analyticsRows.reduce((sum, row) => sum + (row.views || 0), 0);
          clicks = analyticsRows.reduce((sum, row) => sum + (row.clicks || 0), 0);
        }

        // 3. Fetch links count
        const { count: linksCount, error: linksError } = await supabase
          .from("links")
          .select("id", { count: "exact", head: true })
          .eq("tree_id", tree.id);

        if (linksError) throw linksError;

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

  if (hasNoTree) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <SectionHeader 
          title="Dashboard" 
          description="Overview of your link-in-bio pages and analytics."
        />
        <DashboardCard className="py-16 max-w-2xl mx-auto border-white/60 bg-white/40 shadow-sm backdrop-blur-md">
          <div className="flex flex-col items-center justify-center text-center w-full space-y-5">
            <GitBranch className="h-14 w-14 text-primary/60 animate-pulse" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-on-surface">You don't have generated any Blinko Tree</h3>
              <p className="text-xs text-on-surface-variant max-w-md leading-relaxed">
                Create your Blinko Tree to start customizing visual links, social media icons, themes, and tracking real-time click analytics.
              </p>
            </div>
            <Button 
              variant="luminous" 
              size="md" 
              icon={Plus} 
              onClick={() => router.push("/dashboard/blinko-tree/setup")}
            >
              Create a Tree
            </Button>
          </div>
        </DashboardCard>
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
      <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/40 p-6 md:p-8 shadow-sm backdrop-blur-md">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight text-on-surface md:text-3xl font-display-xl">
            Welcome back, {profile?.display_name || user?.email?.split("@")[0] || "Creator"} 👋
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant/80 md:text-base font-body-md">
            Your Blinko Tree is fully initialized. Live data is loading directly from your database.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/dashboard/tree"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white border border-primary/20 shadow-md rounded-full px-5 py-2.5 text-xs font-semibold hover:bg-primary/95 transition-all scale-95 active:scale-90 w-fit"
            >
              <GitBranch className="h-3.5 w-3.5" />
              Customize Tree
            </Link>
            <Link
              href="/dashboard/analytics"
              className="inline-flex items-center justify-center gap-2 bg-white/45 text-on-surface border border-white/60 shadow-sm backdrop-blur-md px-5 py-2.5 rounded-full hover:bg-white/60 transition-all duration-300 scale-95 active:scale-90 text-xs font-semibold"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsList.map((stat) => (
          <StatsCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            timeframe={stat.timeframe}
            iconName={stat.id === "views" ? "Eye" : stat.id === "clicks" ? "MousePointerClick" : stat.id === "ctr" ? "TrendingUp" : "Link2"}
          />
        ))}
      </div>

      {/* Graphs & Charts & Activities */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Analytics Graph */}
        <DashboardCard className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-on-surface">Performance Overview</h3>
                <p className="text-xs text-on-surface-variant/80 mt-0.5">Real-time interactions over the past week</p>
              </div>
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] text-on-surface-variant/70 font-semibold uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
                  Views
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] text-on-surface-variant/70 font-semibold uppercase">
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
                    <stop offset="0%" stopColor="var(--color-tertiary)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--color-tertiary)" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="5" x2="100" y2="5" stroke="rgba(0,0,0,0.06)" strokeWidth="0.1" strokeDasharray="150" />
                <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(0,0,0,0.06)" strokeWidth="0.1" strokeDasharray="150" />
                <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(0,0,0,0.06)" strokeWidth="0.1" strokeDasharray="150" />

                {/* Views Area Fill */}
                <path
                  d="M 0 25 Q 15 15, 30 18 T 60 8 T 85 14 T 100 4 L 100 30 L 0 30 Z"
                  fill="url(#viewsGrad)"
                />
                {/* Views Stroke */}
                <path
                  d="M 0 25 Q 15 15, 30 18 T 60 8 T 85 14 T 100 4"
                  fill="none"
                  stroke="var(--color-tertiary)"
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
              <span className="absolute top-[13%] right-0 h-2 w-2 -translate-x-1/2 rounded-full border-2 border-white bg-tertiary shadow-[0_0_8px_rgba(50,101,120,0.5)]" />
              <span className="absolute top-[40%] right-0 h-2 w-2 -translate-x-1/2 rounded-full border-2 border-white bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>

            {/* X-axis indicators */}
            <div className="flex justify-between text-[10px] text-on-surface-variant/50 mt-2 font-mono font-semibold">
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
          <h3 className="text-base font-semibold text-on-surface">Recent Activity</h3>
          <p className="text-xs text-on-surface-variant/80 mt-0.5 font-body-md">Live interactions on your page</p>

          <div className="mt-6 space-y-4">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex gap-3 text-xs leading-relaxed group">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-black/5 bg-white/50 text-on-surface-variant/65 group-hover:border-primary/30 group-hover:text-primary transition-colors shadow-sm">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-on-surface-variant/80">
                      <span className="text-on-surface font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-[10px] text-on-surface-variant/50 mt-0.5 font-semibold">{activity.details}</p>
                  </div>
                  <span className="text-[10px] text-on-surface-variant/50 shrink-0 font-medium">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </DashboardCard>
      </div>

      {/* Quick Actions Panel */}
      <div className="grid gap-5 sm:grid-cols-3">
        <Link href="/dashboard/tree" className="group">
          <DashboardCard hoverEffect className="flex items-center justify-between border-dashed border-black/15 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-black/5 bg-white/50 p-2.5 text-on-surface-variant/65 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-on-surface">Blinko Tree Settings</h4>
                <p className="text-xs text-on-surface-variant/80 mt-0.5">Bio, template & social connections</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
          </DashboardCard>
        </Link>

        <Link href="/dashboard/tree?tab=links" className="group">
          <DashboardCard hoverEffect className="flex items-center justify-between border-dashed border-black/15 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-black/5 bg-white/50 p-2.5 text-on-surface-variant/65 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
                <Link2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-on-surface">Configure Links</h4>
                <p className="text-xs text-on-surface-variant/80 mt-0.5">Insert custom links & track clicks</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
          </DashboardCard>
        </Link>

        <Link href="/dashboard/tree?tab=design" className="group">
          <DashboardCard hoverEffect className="flex items-center justify-between border-dashed border-black/15 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-black/5 bg-white/50 p-2.5 text-on-surface-variant/65 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-on-surface">Design & Themes</h4>
                <p className="text-xs text-on-surface-variant/80 mt-0.5">Modify styles & layout palettes</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
          </DashboardCard>
        </Link>
      </div>
    </div>
  );
}
