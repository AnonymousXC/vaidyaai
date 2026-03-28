import ActiveNavLink from "@/components/custom/ActiveNavLink";
import MobileSidebar from "@/components/custom/MobileSidebar";
import { signOut } from "@/lib/actions/auth";
import { getPatientDetails } from "@/lib/actions/patient";
import { getSessions } from "@/lib/actions/symptoms";
import { createClient } from "@/lib/supabase/server";
import {
  Heart,
  History,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  User,
} from "@/lib/utils/icons";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [patient, sessions] = await Promise.all([
    getPatientDetails(),
    getSessions(),
  ]);
  const activeCount = sessions.filter((s) => s.status === "active").length;

  const displayName =
    patient?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Patient";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/symptoms", icon: MessageSquare, label: "Symptom Chat", badge: activeCount },
    { href: "/dashboard/patient-details", icon: User, label: "My Details" },
    { href: "/dashboard/history", icon: History, label: "History" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen flex bg-stone-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col bg-white border-r border-slate-100 shadow-sm">
        <div className="px-5 py-5 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-teal-600/25">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="font-bold text-teal-800 text-lg leading-none" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>
                VaidyaAI
              </span>
              <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Health Companion</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Menu</p>
          {navItems.map(({ href, icon, label, badge }) => (
            <ActiveNavLink key={href} href={href} icon={icon} label={label} badge={badge} />
          ))}
        </nav>

        {patient && (
          <div className="mx-3 mb-3 p-3 bg-teal-50/80 rounded-xl border border-teal-100">
            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1">Patient</p>
            <p className="text-sm font-semibold text-slate-700 truncate">{patient.full_name}</p>
            <div className="flex items-center gap-2 mt-1">
              {patient.age && <span className="text-xs text-slate-500">{patient.age}y</span>}
              {patient.blood_group && (
                <span className="text-xs bg-red-50 text-red-600 border border-red-100 rounded-full px-1.5 py-0.5 font-semibold">
                  {patient.blood_group}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="px-3 pb-4 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">{displayName}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <form action={signOut} className="mt-1">
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-medium">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="h-14 border-b border-slate-100 bg-white/90 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <MobileSidebar
              displayName={displayName}
              email={user.email || ""}
              initials={initials}
              patientName={patient?.full_name}
              patientAge={patient?.age}
              patientBloodGroup={patient?.blood_group}
              activeCount={activeCount}
              signOutAction={signOut}
            />
            <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
              <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-bold text-teal-800 text-base" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>
                VaidyaAI
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <Link href="/dashboard/symptoms" className="hidden sm:flex items-center gap-1.5 bg-teal-50 border border-teal-100 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full hover:bg-teal-100 transition-colors">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                {activeCount} active
              </Link>
            )}
            <Link href="/dashboard/settings" className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all" title="Settings">
              <Settings className="w-4 h-4" />
            </Link>
            <div className="lg:hidden w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-auto p-4 sm:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
