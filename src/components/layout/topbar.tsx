"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { projects } from "@/data/projects";
import { gateways } from "@/data/gateways";
import { NotificationBell } from "@/components/shared/notification-bell";

function useBreadcrumbs(pathname: string) {
  const crumbs: { label: string; href: string }[] = [];
  const parts = pathname.split("/").filter(Boolean);

  if (parts[0] === "portfolio") {
    crumbs.push({ label: "Portfolio", href: "/portfolio" });
  }

  if (parts[0] === "project" && parts[1]) {
    crumbs.push({ label: "Portfolio", href: "/portfolio" });
    const project = projects.find((p) => p.id === parts[1]);
    crumbs.push({ label: project?.name || parts[1], href: `/project/${parts[1]}` });

    if (parts[2] === "gateway" && parts[3]) {
      const gw = gateways.find((g) => g.id === parts[3]);
      crumbs.push({
        label: gw ? `${gw.code} — ${gw.name}` : parts[3],
        href: `/project/${parts[1]}/gateway/${parts[3]}`,
      });
    } else if (parts[2] === "gateways") {
      crumbs.push({ label: "Gateways", href: `/project/${parts[1]}/gateways` });
    } else if (parts[2] === "documents") {
      crumbs.push({ label: "Documents", href: `/project/${parts[1]}/documents` });
    } else if (parts[2] === "permissions") {
      crumbs.push({ label: "Access Control", href: `/project/${parts[1]}/permissions` });
    } else if (parts[2] === "ai") {
      crumbs.push({ label: "AI Hub", href: `/project/${parts[1]}/ai` });
    } else if (parts[2] === "supply-chain") {
      crumbs.push({ label: "Supply Chain", href: `/project/${parts[1]}/supply-chain` });
    }
  }

  return crumbs;
}

export function Topbar() {
  const pathname = usePathname();
  const breadcrumbs = useBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-white/[0.06] bg-surface-page/80 backdrop-blur-xl px-8">
      <nav className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-text-disabled" />}
            {i === breadcrumbs.length - 1 ? (
              <span className="font-medium text-text-heading">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-text-muted hover:text-primary transition-colors">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <NotificationBell />
      </div>
    </header>
  );
}
