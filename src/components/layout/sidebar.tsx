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
  Activity,
  Bot,
  GitBranch,
  Workflow,
  ScanSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { projects } from "@/data/projects";
import { currentUser } from "@/data/stakeholders";
import { organizations } from "@/data/stakeholders";
import { useState } from "react";

const projectSubPages = [
  { label: "Overview", href: "", icon: GitBranch },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Doc Intelligence", href: "/document-intelligence", icon: ScanSearch },
  { label: "Access Control", href: "/permissions", icon: Shield },
  { label: "Monitoring", href: "/monitoring", icon: Activity },
  { label: "AI Assistant", href: "/compliance-ai", icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();
  const [projectsOpen, setProjectsOpen] = useState(true);
  const userOrg = organizations.find((o) => o.id === currentUser.organizationId);

  const activeProjectId = projects.find((p) => pathname.includes(p.id))?.id;

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col bg-[#1B2A4A] text-white">
      <div className="flex items-center gap-2 px-5 py-5">
        <Sun className="h-7 w-7 text-amber-400" />
        <span className="text-xl font-bold tracking-tight">SolarComply</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {/* Portfolio */}
        <Link
          href="/portfolio"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10",
            pathname === "/portfolio" && "bg-white/10 border-l-2 border-orange-400"
          )}
        >
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          Portfolio
        </Link>

        {/* Projects */}
        <div>
          <button
            onClick={() => setProjectsOpen(!projectsOpen)}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10",
              pathname.startsWith("/project") && "bg-white/10 border-l-2 border-orange-400"
            )}
          >
            <FolderKanban className="h-5 w-5 shrink-0" />
            <span className="flex-1 text-left">Projects</span>
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", projectsOpen && "rotate-180")}
            />
          </button>
          {projectsOpen && (
            <div className="ml-4 mt-1 space-y-0.5 border-l border-white/20 pl-3">
              {projects.map((p) => (
                <div key={p.id}>
                  <Link
                    href={`/project/${p.id}`}
                    className={cn(
                      "block truncate rounded-md px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/10",
                      activeProjectId === p.id && "text-orange-300"
                    )}
                  >
                    {p.name}
                  </Link>
                  {activeProjectId === p.id && (
                    <div className="ml-3 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                      {projectSubPages.map((sub) => {
                        const subHref = `/project/${p.id}${sub.href}`;
                        const isActive = sub.href === ""
                          ? pathname === `/project/${p.id}`
                          : pathname.startsWith(subHref);
                        return (
                          <Link
                            key={sub.label}
                            href={subHref}
                            className={cn(
                              "flex items-center gap-2 rounded-md px-2 py-1 text-[11px] transition-colors hover:bg-white/10",
                              isActive ? "text-orange-300 bg-white/5" : "text-white/70"
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

        {/* Standards Library */}
        <Link
          href="/standards"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10",
            pathname === "/standards" && "bg-white/10 border-l-2 border-orange-400"
          )}
        >
          <BookOpen className="h-5 w-5 shrink-0" />
          Standards Library
        </Link>

        {/* Gateway Configuration */}
        <Link
          href="/gateway-configuration"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10",
            pathname === "/gateway-configuration" && "bg-white/10 border-l-2 border-orange-400"
          )}
        >
          <Workflow className="h-5 w-5 shrink-0" />
          Gateway Config
        </Link>

        {/* Settings */}
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10",
            pathname === "/settings" && "bg-white/10 border-l-2 border-orange-400"
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          Settings
        </Link>
      </nav>

      <div className="border-t border-white/20 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold">
            {currentUser.avatar || "MS"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{currentUser.name}</p>
            <p className="truncate text-xs text-white/60">{userOrg?.name}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
