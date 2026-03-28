"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface ActiveNavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
}

export default function ActiveNavLink({ href, icon: Icon, label, badge }: ActiveNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "nav-link group",
        isActive && "nav-link-active"
      )}
    >
      <Icon className={cn("w-4 h-4 flex-shrink-0 transition-colors", isActive ? "text-teal-600" : "text-slate-400 group-hover:text-teal-600")} />
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-teal-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
      {!badge && (
        <ChevronRight
          className={cn(
            "w-3.5 h-3.5 transition-all duration-200",
            isActive
              ? "opacity-60 text-teal-600"
              : "opacity-0 group-hover:opacity-40"
          )}
        />
      )}
    </Link>
  );
}
