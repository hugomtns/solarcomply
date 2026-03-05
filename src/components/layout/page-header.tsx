import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {title}
        </h1>
        <div className="mt-2 h-0.5 w-16 rounded-full bg-gradient-to-r from-[#06D6A0] via-[#3B82F6] to-transparent" />
        {description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
