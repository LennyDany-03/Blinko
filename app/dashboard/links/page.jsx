"use client";

import { useState } from "react";
import {
  ExternalLink,
  FileText,
  Plus,
  Trash2,
  Edit2,
  GripVertical,
  ArrowUpRight,
  FolderPlus,
  Check,
  X,
} from "lucide-react";
import { Github, Linkedin } from "../../components/dashboard/BrandIcons";
import { MOCK_LINKS } from "../../constants/dashboardData";
import SectionHeader from "../../components/dashboard/SectionHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import EmptyState from "../../components/dashboard/EmptyState";
import Button from "../../components/Button";

// Map link icon names to Lucide icons
const linkIconMap = {
  Github,
  Linkedin,
  ExternalLink,
  FileText,
};

export default function LinksPage() {
  const [links, setLinks] = useState(MOCK_LINKS);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIcon, setNewIcon] = useState("ExternalLink");

  // Edit states
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editIcon, setEditIcon] = useState("ExternalLink");

  // Toggle link status
  const handleToggleStatus = (id) => {
    setLinks((prev) =>
      prev.map((link) =>
        link.id === id
          ? { ...link, status: link.status === "active" ? "inactive" : "active" }
          : link
      )
    );
  };

  // Delete link
  const handleDeleteLink = (id) => {
    setLinks((prev) => prev.filter((link) => link.id !== id));
  };

  // Add link
  const handleAddLink = (e) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    const newLink = {
      id: `link-${Date.now()}`,
      title: newTitle,
      url: newUrl,
      status: "active",
      clicks: 0,
      iconName: newIcon,
    };

    setLinks((prev) => [...prev, newLink]);
    setNewTitle("");
    setNewUrl("");
    setNewIcon("ExternalLink");
    setIsAdding(false);
  };

  // Start edit
  const startEdit = (link) => {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
    setEditIcon(link.iconName);
  };

  // Save edit
  const saveEdit = (id) => {
    setLinks((prev) =>
      prev.map((link) =>
        link.id === id
          ? { ...link, title: editTitle, url: editUrl, iconName: editIcon }
          : link
      )
    );
    setEditingId(null);
  };

  // Reset demo links
  const handleResetDemo = () => {
    setLinks(MOCK_LINKS);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <SectionHeader title="Manage Links" description="Create, edit, and reorganize custom links to track performance.">
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? "Close Panel" : "Add Link"}
        </Button>
      </SectionHeader>

      {/* Add New Link Slide-down panel */}
      {isAdding && (
        <DashboardCard className="border-violet-500/20 bg-zinc-950/80 animate-in slide-in-from-top-4 duration-200">
          <h3 className="text-sm font-semibold text-white mb-4">Add New Link</h3>
          <form onSubmit={handleAddLink} className="grid gap-4 sm:grid-cols-4 items-end">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Link Title</label>
              <input
                type="text"
                placeholder="e.g. GitHub Profile"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-xs text-zinc-200 outline-none transition focus:border-violet-500/50"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Destination URL</label>
              <input
                type="url"
                placeholder="https://"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-xs text-zinc-200 outline-none transition focus:border-violet-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Icon Type</label>
              <div className="flex gap-2">
                <select
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="flex-1 rounded-lg border border-zinc-900 bg-zinc-900/45 px-2 py-2 text-xs text-zinc-300 outline-none focus:border-violet-500/50"
                >
                  <option value="ExternalLink">Website / Link</option>
                  <option value="Github">GitHub</option>
                  <option value="Linkedin">LinkedIn</option>
                  <option value="FileText">Resume / Doc</option>
                </select>
                <Button type="submit" variant="primary" className="h-[34px] px-4 shrink-0 text-xs">
                  Create
                </Button>
              </div>
            </div>
          </form>
        </DashboardCard>
      )}

      {/* Main Content Area */}
      {links.length === 0 ? (
        <EmptyState
          icon={FolderPlus}
          title="No links found"
          description="Build out your list by adding direct items like social accounts, repositories, folders, or PDF documentation links."
          actionText="Repopulate Mock Links"
          onActionClick={handleResetDemo}
        />
      ) : (
        <DashboardCard className="overflow-x-auto p-0">
          <div className="min-w-[600px] w-full divide-y divide-zinc-900">
            {/* Table Header */}
            <div className="grid grid-cols-[auto_1.5fr_2fr_1fr_1fr_1.2fr] gap-4 px-6 py-3.5 bg-zinc-950/60 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              <div className="w-6" /> {/* Reorder handle header */}
              <div>Title</div>
              <div>Destination URL</div>
              <div>Status</div>
              <div className="text-right">Clicks</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-zinc-900/60 bg-zinc-950/20">
              {links.map((link) => {
                const Icon = linkIconMap[link.iconName] || ExternalLink;
                const isEditing = editingId === link.id;

                return (
                  <div
                    key={link.id}
                    className="grid grid-cols-[auto_1.5fr_2fr_1fr_1fr_1.2fr] gap-4 items-center px-6 py-3.5 hover:bg-zinc-900/20 transition group"
                  >
                    {/* Drag Handle Indicator */}
                    <div className="cursor-grab active:cursor-grabbing text-zinc-700 hover:text-zinc-400 p-1">
                      <GripVertical className="h-4 w-4" />
                    </div>

                    {/* Title */}
                    <div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-white"
                        />
                      ) : (
                        <span className="flex items-center gap-2 text-xs font-semibold text-white">
                          <span className="rounded bg-zinc-900 p-1.5 text-violet-400 border border-zinc-800">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          {link.title}
                        </span>
                      )}
                    </div>

                    {/* URL */}
                    <div className="text-xs truncate max-w-[200px]">
                      {isEditing ? (
                        <input
                          type="url"
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          className="w-full rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-white"
                        />
                      ) : (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-400 hover:text-violet-400 transition inline-flex items-center gap-1"
                        >
                          {link.url}
                          <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                    </div>

                    {/* Status Pill Toggle */}
                    <div>
                      <button
                        onClick={() => handleToggleStatus(link.id)}
                        className={[
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition border cursor-pointer",
                          link.status === "active"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25"
                            : "bg-zinc-800/40 border-zinc-800 text-zinc-500 hover:bg-zinc-800/80",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "h-1.5 w-1.5 rounded-full",
                            link.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-zinc-600",
                          ].join(" ")}
                        />
                        {link.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </div>

                    {/* Clicks */}
                    <div className="text-right text-xs font-mono text-zinc-300">
                      {link.clicks.toLocaleString()}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1.5">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEdit(link.id)}
                            className="rounded-lg p-1.5 text-emerald-400 hover:bg-emerald-500/10 transition"
                            aria-label="Save"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 transition"
                            aria-label="Cancel"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(link)}
                            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white transition"
                            aria-label="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLink(link.id)}
                            className="rounded-lg p-1.5 text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DashboardCard>
      )}
    </div>
  );
}
