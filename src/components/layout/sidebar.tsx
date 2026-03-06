"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  Settings,
  ChevronDown,
  Sun,
  FileText,
  Shield,
  Bot,
  GitBranch,
  Workflow,
  Link2,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { projects } from "@/data/projects";
import { currentUser } from "@/data/stakeholders";
import { organizations } from "@/data/stakeholders";
import { useState } from "react";

const coreSubPages = [
  { label: "Overview", href: "", icon: GitBranch },
  { label: "Gateways", href: "/gateways", icon: Layers },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "AI Hub", href: "/ai", icon: Bot },
];

const enterpriseSubPages = [
  { label: "Access Control", href: "/permissions", icon: Shield },
  { label: "Supply Chain", href: "/supply-chain", icon: Link2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [projectsOpen, setProjectsOpen] = useState(true);
  const userOrg = organizations.find((o) => o.id === currentUser.organizationId);

  const activeProjectId = projects.find((p) => pathname.includes(p.id))?.id;

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-white/[0.06] bg-[#070d1a]/95 backdrop-blur-xl text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-[0_0_20px_rgba(6,214,160,0.3)]">
          <Sun className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold font-display tracking-tight">
          SolarComply
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {/* Portfolio */}
        <Link
          href="/portfolio"
          className={cn(
            "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
            pathname === "/portfolio"
              ? "bg-primary/10 text-primary"
              : "text-text-tertiary hover:bg-surface-glass hover:text-text-heading"
          )}
        >
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          Portfolio
          {pathname === "/portfolio" && (
            <span className="absolute left-0 h-8 w-1 rounded-r-full bg-primary shadow-[0_0_8px_rgba(6,214,160,0.5)]" />
          )}
        </Link>

        {/* Projects */}
        <div className="relative mt-1">
          <button
            onClick={() => setProjectsOpen(!projectsOpen)}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              pathname.startsWith("/project")
                ? "bg-primary/10 text-primary"
                : "text-text-tertiary hover:bg-surface-glass hover:text-text-heading"
            )}
          >
            <FolderKanban className="h-5 w-5 shrink-0" />
            <span className="flex-1 text-left">Projects</span>
            <ChevronDown
              className={cn("h-4 w-4 transition-transform duration-200", projectsOpen && "rotate-180")}
            />
            {pathname.startsWith("/project") && (
              <span className="absolute left-0 h-8 w-1 rounded-r-full bg-primary shadow-[0_0_8px_rgba(6,214,160,0.5)]" />
            )}
          </button>
          {projectsOpen && (
            <div className="ml-4 mt-1 space-y-0.5 border-l border-white/[0.06] pl-3">
              {projects.map((p) => (
                <div key={p.id}>
                  <Link
                    href={`/project/${p.id}`}
                    className={cn(
                      "block truncate rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                      activeProjectId === p.id
                        ? "text-primary"
                        : "text-text-muted hover:bg-surface-glass hover:text-text-secondary"
                    )}
                  >
                    {p.name}
                  </Link>
                  {activeProjectId === p.id && (
                    <div className="ml-3 mt-1 space-y-0.5">
                      {/* Core section */}
                      <p className="px-2 pt-1 pb-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-text-disabled">
                        Core
                      </p>
                      {coreSubPages.map((sub) => {
                        const subHref = `/project/${p.id}${sub.href}`;
                        const isActive = sub.href === ""
                          ? pathname === `/project/${p.id}`
                          : pathname.startsWith(subHref);
                        return (
                          <Link
                            key={sub.label}
                            href={subHref}
                            className={cn(
                              "flex items-center gap-2 rounded-lg px-2 py-1 text-[11px] transition-all duration-200",
                              isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-text-muted hover:bg-surface-glass hover:text-text-secondary"
                            )}
                          >
                            <sub.icon className="h-3.5 w-3.5 shrink-0" />
                            {sub.label}
                          </Link>
                        );
                      })}

                      {/* Divider */}
                      <div className="mx-2 my-1.5 border-t border-white/[0.04]" />

                      {/* Enterprise section */}
                      <p className="px-2 pt-0.5 pb-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-text-disabled">
                        Enterprise
                      </p>
                      {enterpriseSubPages.map((sub) => {
                        const subHref = `/project/${p.id}${sub.href}`;
                        const isActive = pathname.startsWith(subHref);
                        return (
                          <Link
                            key={sub.label}
                            href={subHref}
                            className={cn(
                              "flex items-center gap-2 rounded-lg px-2 py-1 text-[11px] transition-all duration-200",
                              isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-text-muted hover:bg-surface-glass hover:text-text-secondary"
                            )}
                          >
                            <sub.icon className="h-3.5 w-3.5 shrink-0" />
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mx-3 my-3 border-t border-white/[0.04]" />

        {/* Standards Library */}
        <Link
          href="/standards"
          className={cn(
            "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
            pathname === "/standards"
              ? "bg-primary/10 text-primary"
              : "text-text-tertiary hover:bg-surface-glass hover:text-text-heading"
          )}
        >
          <BookOpen className="h-5 w-5 shrink-0" />
          Standards Library
          {pathname === "/standards" && (
            <span className="absolute left-0 h-8 w-1 rounded-r-full bg-primary shadow-[0_0_8px_rgba(6,214,160,0.5)]" />
          )}
        </Link>

        {/* Gateway Configuration */}
        <Link
          href="/gateway-configuration"
          className={cn(
            "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
            pathname === "/gateway-configuration"
              ? "bg-primary/10 text-primary"
              : "text-text-tertiary hover:bg-surface-glass hover:text-text-heading"
          )}
        >
          <Workflow className="h-5 w-5 shrink-0" />
          Gateway Config
          {pathname === "/gateway-configuration" && (
            <span className="absolute left-0 h-8 w-1 rounded-r-full bg-primary shadow-[0_0_8px_rgba(6,214,160,0.5)]" />
          )}
        </Link>

        {/* Settings */}
        <Link
          href="/settings"
          className={cn(
            "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
            pathname === "/settings"
              ? "bg-primary/10 text-primary"
              : "text-text-tertiary hover:bg-surface-glass hover:text-text-heading"
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          Settings
          {pathname === "/settings" && (
            <span className="absolute left-0 h-8 w-1 rounded-r-full bg-primary shadow-[0_0_8px_rgba(6,214,160,0.5)]" />
          )}
        </Link>
      </nav>

      <div className="border-t border-white/[0.06] px-4 py-4 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-sm font-semibold ring-2 ring-primary/20">
            {currentUser.avatar || "MS"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-heading">{currentUser.name}</p>
            <p className="truncate text-xs text-text-muted">{userOrg?.name}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
