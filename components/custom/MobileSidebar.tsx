"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Heart,
  Menu,
  X,
  LayoutDashboard,
  MessageSquare,
  User,
  History,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface MobileSidebarProps {
  displayName: string;
  email: string;
  initials: string;
  patientName?: string;
  patientAge?: number;
  patientBloodGroup?: string;
  activeCount: number;
  signOutAction: () => void;
}

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/symptoms", icon: MessageSquare, label: "Symptom Chat" },
  { href: "/dashboard/patient-details", icon: User, label: "My Details" },
  { href: "/dashboard/history", icon: History, label: "History" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function MobileSidebar({
  displayName,
  email,
  initials,
  patientName,
  patientAge,
  patientBloodGroup,
  activeCount,
  signOutAction,
}: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center justify-center w-8 h-8 rounded-xl text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-all"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-72 z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-teal-600/25">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span
                className="font-bold text-teal-800 text-lg leading-none"
                style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
              >
                VaidyaAI
              </span>
              <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
                Health Companion
              </p>
            </div>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Menu
          </p>
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            const badge =
              label === "Symptom Chat" && activeCount > 0 ? activeCount : undefined;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "nav-link group",
                  isActive && "nav-link-active"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 flex-shrink-0 transition-colors",
                    isActive
                      ? "text-teal-600"
                      : "text-slate-400 group-hover:text-teal-600"
                  )}
                />
                <span className="flex-1">{label}</span>
                {badge ? (
                  <span className="bg-teal-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {badge > 9 ? "9+" : badge}
                  </span>
                ) : (
                  <ChevronRight
                    className={cn(
                      "w-3.5 h-3.5 transition-all",
                      isActive ? "opacity-60 text-teal-600" : "opacity-0 group-hover:opacity-40"
                    )}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Patient card */}
        {patientName && (
          <div className="mx-3 mb-3 p-3 bg-teal-50/80 rounded-xl border border-teal-100">
            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1">
              Patient
            </p>
            <p className="text-sm font-semibold text-slate-700 truncate">{patientName}</p>
            <div className="flex items-center gap-2 mt-1">
              {patientAge && (
                <span className="text-xs text-slate-500">{patientAge}y</span>
              )}
              {patientBloodGroup && (
                <span className="text-xs bg-red-50 text-red-600 border border-red-100 rounded-full px-1.5 py-0.5 font-semibold">
                  {patientBloodGroup}
                </span>
              )}
            </div>
          </div>
        )}

        {/* User section */}
        <div className="px-3 pb-5 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
            <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">{displayName}</p>
              <p className="text-xs text-slate-400 truncate">{email}</p>
            </div>
          </div>
          <form action={signOutAction} className="mt-1">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
