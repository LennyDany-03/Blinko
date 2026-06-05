"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, MousePointerClick, TrendingUp, BarChart3, Loader2, ArrowRight, Sparkles, Link2 } from "lucide-react";
import SectionHeader from "../../components/dashboard/SectionHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import StatsCard from "../../components/dashboard/StatsCard";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Loading states
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({ views: 0, clicks: 0 });
  const [linksList, setLinksList] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);

        // 1. Fetch user's tree
        const { data: tree, error: treeError } = await supabase
          .from("trees")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (treeError) throw treeError;

        if (!tree) {
          router.push("/dashboard/blinko-tree/setup");
          return;
        }

        // 2. Fetch analytics row
        const { data: analyticsRow, error: analyticsError } = await supabase
          .from("analytics")
          .select("views, clicks")
          .eq("tree_id", tree.id)
          .maybeSingle();

        if (analyticsError && analyticsError.code !== "PGRST116") throw analyticsError;

        if (analyticsRow) {
          setAnalytics({
            views: analyticsRow.views,
            clicks: analyticsRow.clicks
          });
        }

        // 3. Fetch links list sorted by clicks to show performing links
        const { data: linksData } = await supabase
          .from("links")
          .select("title, url, click_count, active")
          .eq("tree_id", tree.id)
          .order("click_count", { ascending: false });

        if (linksData) {
          setLinksList(linksData);
        }

      } catch (err) {
        console.error("Analytics Page Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-violet-500 mx-auto" />
          <p className="text-sm text-zinc-400">Loading analytics performance logs...</p>
        </div>
      </div>
    );
  }

  const ctr = analytics.views > 0 ? ((analytics.clicks / analytics.views) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <SectionHeader 
        title="Analytics Overview" 
        description="Monitor views, link clicks, CTR performance metrics, and top link statistics."
      />

      {/* Grid of Stats */}
      <div className="grid gap-5 sm:grid-cols-3">
        <StatsCard
          label="Total Views"
          value={analytics.views.toLocaleString()}
          change="+0% vs last week"
          isPositive={true}
          timeframe="All time"
          iconName="Eye"
        />
        <StatsCard
          label="Total Clicks"
          value={analytics.clicks.toLocaleString()}
          change="+0% vs last week"
          isPositive={true}
          timeframe="All time"
          iconName="MousePointerClick"
        />
        <StatsCard
          label="Click-Through Rate (CTR)"
          value={`${ctr}%`}
          change="0.0% vs last week"
          isPositive={true}
          timeframe="Conversion"
          iconName="TrendingUp"
        />
      </div>

      {/* Analytics Chart & Top Links Leaderboard */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance SVG graph */}
        <DashboardCard className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Performance Charts</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Views vs Clicks over active intervals</p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                Views ({analytics.views})
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Clicks ({analytics.clicks})
              </span>
            </div>
          </div>

          {/* SVG line graph mock */}
          <div className="relative h-56 w-full">
            <svg className="h-full w-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="5" x2="100" y2="5" stroke="#222" strokeWidth="0.1" strokeDasharray="1" />
              <line x1="0" y1="15" x2="100" y2="15" stroke="#222" strokeWidth="0.1" strokeDasharray="1" />
              <line x1="0" y1="25" x2="100" y2="25" stroke="#222" strokeWidth="0.1" strokeDasharray="1" />

              {/* Views Area Fill */}
              <path
                d="M 0 25 Q 15 12, 30 15 T 60 6 T 85 10 T 100 2 L 100 30 L 0 30 Z"
                fill="url(#viewsGrad)"
              />
              {/* Views Stroke */}
              <path
                d="M 0 25 Q 15 12, 30 15 T 60 6 T 85 10 T 100 2"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="0.65"
                strokeLinecap="round"
              />

              {/* Clicks Area Fill */}
              <path
                d="M 0 28 Q 15 20, 30 22 T 60 14 T 85 18 T 100 10 L 100 30 L 0 30 Z"
                fill="url(#clicksGrad)"
              />
              {/* Clicks Stroke */}
              <path
                d="M 0 28 Q 15 20, 30 22 T 60 14 T 85 18 T 100 10"
                fill="none"
                stroke="#10b981"
                strokeWidth="0.65"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-zinc-650 font-mono">
            <span>Monday</span>
            <span>Wednesday</span>
            <span>Friday</span>
            <span>Today</span>
          </div>
        </DashboardCard>

        {/* Top Link Leaderboard */}
        <DashboardCard className="space-y-6">
          <div>
            <h3 className="text-base font-semibold text-white">Top Performing Links</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Link clicks leaderboard statistics</p>
          </div>

          {linksList.length === 0 ? (
            <div className="py-8 text-center text-zinc-600 text-xs italic">
              No links created yet.
            </div>
          ) : (
            <div className="space-y-4">
              {linksList.slice(0, 5).map((link, idx) => (
                <div key={link.title} className="flex items-center justify-between text-xs border-b border-zinc-900 pb-3">
                  <div className="min-w-0 pr-2">
                    <h4 className="font-semibold text-zinc-200 truncate">{link.title}</h4>
                    <p className="text-[10px] text-zinc-600 truncate mt-0.5">{link.url}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-zinc-300 font-bold">{link.click_count || 0}</span>
                    <span className="text-[9px] text-zinc-600 block">clicks</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  );
}
