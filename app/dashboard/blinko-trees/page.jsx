"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, Eye, Edit2, Trash2, Globe, BarChart3, Loader2, Calendar, 
  Sparkles, X, CheckCircle, Shield, AlertCircle 
} from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";
import SectionHeader from "../../components/dashboard/SectionHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Button from "../../components/Button";

export default function BlinkoTreesDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  // Component states
  const [loading, setLoading] = useState(true);
  const [trees, setTrees] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirmTree, setDeleteConfirmTree] = useState(null);
  const [showDeleteErrorModal, setShowDeleteErrorModal] = useState(false);

  const loadTreesData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Subscription status
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      const userIsPro = sub?.status === "active";
      setIsPro(userIsPro);

      // 2. Fetch all trees owned by this user
      const { data: userTrees } = await supabase
        .from("trees")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (userTrees) {
        setTrees(userTrees);

        if (userTrees.length > 0) {
          // 3. Fetch analytics for these trees
          const treeIds = userTrees.map(t => t.id);
          const { data: analData } = await supabase
            .from("analytics")
            .select("tree_id, views, clicks")
            .in("tree_id", treeIds);

          const analMap = {};
          if (analData) {
            analData.forEach(row => {
              analMap[row.tree_id] = {
                views: row.views || 0,
                clicks: row.clicks || 0
              };
            });
          }
          setAnalytics(analMap);
        }
      }
    } catch (err) {
      console.error("Load Trees Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    Promise.resolve().then(() => {
      loadTreesData();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCreateNewTree = () => {
    const treeCount = trees.length;
    if (treeCount >= 2 && !isPro) {
      setShowUpgradeModal(true);
      return;
    }
    // Redirect to onboarding setup wizard
    router.push("/dashboard/blinko-tree/setup");
  };

  const handleDeleteTree = (tree) => {
    if (trees.length <= 1) {
      setShowDeleteErrorModal(true);
      return;
    }
    setDeleteConfirmTree(tree);
  };

  const executeDeleteTree = async (tree) => {
    setDeletingId(tree.id);
    try {
      const { error } = await supabase
        .from("trees")
        .delete()
        .eq("id", tree.id);

      if (error) throw error;

      setTrees(prev => prev.filter(t => t.id !== tree.id));
      
      // If we deleted the active tree, set the first remaining one to active
      if (tree.is_active && trees.length > 1) {
        const remaining = trees.filter(t => t.id !== tree.id);
        const newActive = remaining[0];
        
        await supabase
          .from("trees")
          .update({ is_active: true })
          .eq("id", newActive.id);
      }

      // Dispatch custom sidebar/navbar triggers
      window.dispatchEvent(new Event("activeTreeChanged"));
    } catch (err) {
      console.error("Delete Tree Error:", err);
      alert(err.message || "Failed to delete tree.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-violet-500 mx-auto" />
          <p className="text-sm text-zinc-400">Loading your Blinko Trees...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      <SectionHeader 
        title="My Blinko Trees" 
        description="Manage all your public bio pages from one place."
      >
        <Button 
          variant="luminous" 
          size="sm" 
          icon={Plus} 
          onClick={handleCreateNewTree}
        >
          Create New Tree
        </Button>
      </SectionHeader>

      {trees.length === 0 ? (
        <DashboardCard className="py-12 text-center max-w-2xl mx-auto space-y-4">
          <Globe className="h-12 w-12 text-on-surface-variant/60 mx-auto" />
          <h3 className="text-lg font-bold text-on-surface">No Blinko Trees found</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
            Create your first public page to display visual links, portfolio projects, digital products, and start tracking views.
          </p>
          <Button variant="luminous" size="sm" icon={Plus} onClick={handleCreateNewTree}>
            Create your first tree
          </Button>
        </DashboardCard>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trees.map(tree => {
            const stats = analytics[tree.id] || { views: 0, clicks: 0 };
            const creationDate = new Date(tree.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            });
            const publicUrl = `/${tree.slug}`;

            return (
              <DashboardCard 
                key={tree.id}
                className="flex flex-col justify-between border-white/60 bg-white/40 shadow-sm backdrop-blur-md hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 group relative"
              >
                {/* Active Indicator Badge */}
                {tree.is_active && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-on-surface group-hover:text-primary transition-colors">
                      {tree.name}
                    </h3>
                    <a 
                      href={publicUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[11px] font-semibold text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1.5 mt-1"
                    >
                      <Globe className="h-3 w-3 text-on-surface-variant/70 shrink-0" />
                      blinko.site{publicUrl}
                    </a>
                  </div>

                  {/* Analytics snapshot grid */}
                  <div className="grid grid-cols-2 gap-2 bg-white/50 border border-black/5 rounded-lg p-2.5 shadow-inner">
                    <div>
                      <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">
                        <Eye className="h-3 w-3 text-on-surface-variant/70" />
                        Views
                      </span>
                      <p className="text-sm font-bold text-on-surface mt-0.5">{stats.views.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">
                        <BarChart3 className="h-3 w-3 text-on-surface-variant/70" />
                        Clicks
                      </span>
                      <p className="text-sm font-bold text-on-surface mt-0.5">{stats.clicks.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-on-surface-variant/70">
                    <Calendar className="h-3 w-3 text-on-surface-variant/70" />
                    <span>Created: {creationDate}</span>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="flex gap-2.5 pt-6 border-t border-black/5 mt-6">
                  <button
                    onClick={() => router.push(`/dashboard/tree?id=${tree.id}`)}
                    className="flex-1 flex h-9 items-center justify-center gap-1.5 rounded-lg border border-black/10 bg-white/60 text-xs font-bold text-on-surface hover:bg-white/95 transition cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white/60 text-on-surface-variant hover:text-on-surface transition"
                    title="View public page"
                  >
                    <Eye className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteTree(tree)}
                    disabled={deletingId === tree.id}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition cursor-pointer disabled:opacity-50"
                    title="Delete page"
                  >
                    {deletingId === tree.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </DashboardCard>
            );
          })}
        </div>
      )}

      {/* FREEMIUM UPGRADE MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 select-none">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/60 bg-white/80 backdrop-blur-2xl p-6 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <h3 className="text-xl font-extrabold text-on-surface">🚀 Unlock Unlimited Blinko Trees</h3>
            <p className="text-xs text-on-surface-variant mt-2 max-w-sm mx-auto leading-relaxed">
              You have reached the free plan limit of 2 trees. Upgrade to Pro to create unlimited trees and unlock advanced features.
            </p>

            {/* Benefits list */}
            <div className="mt-6 grid gap-2.5 text-left max-h-52 overflow-y-auto pr-1">
              {[
                { title: "Unlimited Blinko Trees", desc: "Create as many public pages as you want." },
                { title: "Advanced Analytics", desc: "Track Views, Clicks, CTR, Top Links, Traffic Sources, Device stats." },
                { title: "Premium Themes", desc: "Access all premium designs (Neon, Cyberpunk, Glassmorphism)." },
                { title: "Custom Domains", desc: "Use yourname.com instead of blinko.site/username." },
                { title: "Remove Blinko Branding", desc: "Remove all platform watermarks." }
              ].map((benefit, idx) => (
                <div key={idx} className="flex gap-2.5 rounded-lg border border-black/5 bg-white/50 p-2.5 text-xs">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-on-surface">{benefit.title}</h4>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal actions buttons */}
            <div className="mt-8 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  router.push("/dashboard/billing");
                }}
                className="w-full flex h-11 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white hover:bg-primary/95 transition cursor-pointer shadow-sm"
              >
                Upgrade to Pro
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full text-on-surface-variant hover:text-primary text-xs font-semibold py-2 transition cursor-pointer"
              >
                Not Right Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LAST TREE DELETE WARNING MODAL */}
      {showDeleteErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 select-none">
          <div className="relative w-full max-w-md rounded-2xl border border-white/60 bg-white/80 backdrop-blur-2xl p-6 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowDeleteErrorModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-rose-500 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 mb-4">
              <AlertCircle className="h-6 w-6 animate-bounce" />
            </div>
            <h3 className="text-lg font-extrabold text-on-surface">Delete Not Allowed</h3>
            <p className="text-xs text-on-surface-variant mt-2 max-w-xs mx-auto leading-relaxed">
              You must keep at least one Blinko Tree page active. You cannot delete your only page.
            </p>

            {/* Modal actions buttons */}
            <div className="mt-6">
              <button
                onClick={() => setShowDeleteErrorModal(false)}
                className="w-full flex h-10 items-center justify-center rounded-lg bg-zinc-800 text-xs font-bold text-white hover:bg-zinc-700 transition cursor-pointer shadow-sm"
              >
                Okay, I understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmTree && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 select-none">
          <div className="relative w-full max-w-md rounded-2xl border border-white/60 bg-white/80 backdrop-blur-2xl p-6 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setDeleteConfirmTree(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-rose-500 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 mb-4">
              <Trash2 className="h-6 w-6 animate-pulse" />
            </div>
            <h3 className="text-lg font-extrabold text-on-surface">Delete Blinko Tree?</h3>
            <p className="text-xs text-on-surface-variant mt-2 max-w-xs mx-auto leading-relaxed">
              Are you sure you want to permanently delete the Blinko Tree <strong className="text-zinc-800 font-bold">"{deleteConfirmTree.name}"</strong> (blinko.site/{deleteConfirmTree.slug})?
            </p>
            <p className="text-[10px] text-rose-500 font-bold bg-rose-500/5 border border-rose-500/10 rounded-lg p-2.5 mt-3 text-left">
              ⚠️ Warning: All links, customizations, and visitor analytics logs will be lost forever. This action is irreversible.
            </p>

            {/* Modal actions buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirmTree(null)}
                className="flex-1 flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white hover:bg-zinc-50 text-xs font-bold text-on-surface-variant transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const targetTree = deleteConfirmTree;
                  setDeleteConfirmTree(null);
                  await executeDeleteTree(targetTree);
                }}
                className="flex-1 flex h-10 items-center justify-center rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition cursor-pointer shadow-sm"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
