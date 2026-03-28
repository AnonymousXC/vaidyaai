import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className
      )}
    >
      <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
        <Icon className="w-7 h-7 text-slate-300" />
      </div>
      <h3
        className="text-lg font-bold text-slate-700 mb-1.5"
        style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
      >
        {title}
      </h3>
      <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-5">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all shadow-md shadow-teal-600/20"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
