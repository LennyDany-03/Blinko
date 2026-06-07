"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, MousePointerClick, TrendingUp, Loader2, Plus, GitBranch } from "lucide-react";
import SectionHeader from "../../components/dashboard/SectionHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import StatsCard from "../../components/dashboard/StatsCard";
import Button from "../../components/Button";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Loading states
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({ views: 0, clicks: 0 });
  const [linksList, setLinksList] = useState([]);
  const [hasNoTree, setHasNoTree] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchAnalyticsData = async () => {
      try {
        // 1. Fetch user's tree
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

        // 2. Fetch analytics row
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

        setAnalytics({
          views,
          clicks
        });

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
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-sm text-on-surface-variant">Loading analytics performance logs...</p>
        </div>
      </div>
    );
  }

  if (hasNoTree) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <SectionHeader 
          title="Analytics Overview" 
          description="Monitor views, link clicks, CTR performance metrics, and top link statistics."
        />
        <DashboardCard className="py-16 max-w-2xl mx-auto border-white/60 bg-white/40 shadow-sm backdrop-blur-md">
          <div className="flex flex-col items-center justify-center text-center w-full space-y-5">
            <TrendingUp className="h-14 w-14 text-primary/60 animate-pulse" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-on-surface">You don't have generated any Blinko Tree</h3>
              <p className="text-xs text-on-surface-variant max-w-md leading-relaxed">
                Create your Blinko Tree to start collecting view counts, link clicks, click-through rates, and traffic referrals.
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
              <h3 className="text-base font-semibold text-on-surface">Performance Charts</h3>
              <p className="text-xs text-on-surface-variant/70 mt-0.5">Views vs Clicks over active intervals</p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] text-on-surface-variant">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Views ({analytics.views})
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-on-surface-variant">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Clicks ({analytics.clicks})
              </span>
            </div>
          </div>

          {/* SVG line graph */}
          <div className="relative h-56 w-full">
            <svg className="h-full w-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="5" x2="100" y2="5" stroke="rgba(137, 114, 107, 0.15)" strokeWidth="0.1" strokeDasharray="1" />
              <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(137, 114, 107, 0.15)" strokeWidth="0.1" strokeDasharray="1" />
              <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(137, 114, 107, 0.15)" strokeWidth="0.1" strokeDasharray="1" />

              {/* Views Area Fill */}
              <path
                d="M 0 25 Q 15 12, 30 15 T 60 6 T 85 10 T 100 2 L 100 30 L 0 30 Z"
                fill="url(#viewsGrad)"
              />
              {/* Views Stroke */}
              <path
                d="M 0 25 Q 15 12, 30 15 T 60 6 T 85 10 T 100 2"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="0.75"
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
                stroke="var(--color-secondary)"
                strokeWidth="0.75"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
            <span>Monday</span>
            <span>Wednesday</span>
            <span>Friday</span>
            <span>Today</span>
          </div>
        </DashboardCard>

        {/* Top Link Leaderboard */}
        <DashboardCard className="space-y-6">
          <div>
            <h3 className="text-base font-semibold text-on-surface">Top Performing Links</h3>
            <p className="text-xs text-on-surface-variant/70 mt-0.5">Link clicks leaderboard statistics</p>
          </div>

          {linksList.length === 0 ? (
            <div className="py-8 text-center text-on-surface-variant/60 text-xs italic">
              No links created yet.
            </div>
          ) : (
            <div className="space-y-4">
              {linksList.slice(0, 5).map((link, idx) => (
                <div key={link.title} className="flex items-center justify-between text-xs border-b border-black/5 pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0 pr-2">
                    <h4 className="font-semibold text-on-surface truncate">{link.title}</h4>
                    <p className="text-[10px] text-on-surface-variant/70 truncate mt-0.5">{link.url}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-on-surface font-bold">{link.click_count || 0}</span>
                    <span className="text-[9px] text-on-surface-variant/70 block">clicks</span>
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
