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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { projects } from "@/data/projects";
import { currentUser } from "@/data/stakeholders";
import { organizations } from "@/data/stakeholders";
import { useState } from "react";

const navItems = [
  { label: "Portfolio", href: "/portfolio", icon: LayoutDashboard },
  { label: "Projects", href: "#projects", icon: FolderKanban, hasSubmenu: true },
  { label: "Standards Library", href: "/standards", icon: BookOpen },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [projectsOpen, setProjectsOpen] = useState(true);
  const userOrg = organizations.find((o) => o.id === currentUser.organizationId);

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col bg-[#1B2A4A] text-white">
      <div className="flex items-center gap-2 px-5 py-5">
        <Sun className="h-7 w-7 text-amber-400" />
        <span className="text-xl font-bold tracking-tight">SolarComply</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => {
          if (item.hasSubmenu) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => setProjectsOpen(!projectsOpen)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10",
                    pathname.startsWith("/project") && "bg-white/10 border-l-2 border-orange-400"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", projectsOpen && "rotate-180")}
                  />
                </button>
                {projectsOpen && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-white/20 pl-4">
                    {projects.map((p) => (
                      <Link
                        key={p.id}
                        href={`/project/${p.id}`}
                        className={cn(
                          "block truncate rounded-md px-3 py-1.5 text-xs transition-colors hover:bg-white/10",
                          pathname.includes(p.id) && "bg-white/10 text-orange-300"
                        )}
                      >
                        {p.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10",
                pathname === item.href && "bg-white/10 border-l-2 border-orange-400"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
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
