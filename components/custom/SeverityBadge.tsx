import { cn } from "@/lib/utils";

const SEVERITY_MAP: Record<string, { label: string; cls: string }> = {
  mild:     { label: "Mild",     cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  moderate: { label: "Moderate", cls: "text-amber-700 bg-amber-50 border-amber-200" },
  severe:   { label: "Severe",   cls: "text-orange-700 bg-orange-50 border-orange-200" },
  critical: { label: "Critical", cls: "text-red-700 bg-red-50 border-red-200" },
};

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  active:   { label: "Active",   cls: "text-blue-700 bg-blue-50 border-blue-200" },
  resolved: { label: "Resolved", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  referred: { label: "Referred", cls: "text-purple-700 bg-purple-50 border-purple-200" },
};

interface BadgeProps {
  value: string;
  type: "severity" | "status";
  className?: string;
}

export default function SeverityBadge({ value, type, className }: BadgeProps) {
  const map = type === "severity" ? SEVERITY_MAP : STATUS_MAP;
  const entry = map[value] ?? { label: value, cls: "text-slate-600 bg-slate-50 border-slate-200" };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border",
        entry.cls,
        className
      )}
    >
      {entry.label}
    </span>
  );
}
