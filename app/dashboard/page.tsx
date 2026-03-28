import { createClient } from "@/lib/supabase/server";
import { getPatientDetails } from "@/lib/actions/patient";
import { getSessions } from "@/lib/actions/symptoms";
import Link from "next/link";
import { formatDate, getSeverityColor, getStatusColor } from "@/lib/utils";
import {
  MessageSquare,
  User,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus,
  Stethoscope,
  Globe,
  Heart,
  ArrowRight,
} from "lucide-react";

export default async function DashboardOverviewPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [patient, sessions] = await Promise.all([
    getPatientDetails(),
    getSessions(),
  ]);

  const firstName =
    patient?.full_name?.split(" ")[0] ||
    user?.user_metadata?.full_name?.split(" ")[0] ||
    "there";

  const totalSessions = sessions.length;
  const activeSessions = sessions.filter((s) => s.status === "active").length;
  const resolvedSessions = sessions.filter((s) => s.status === "resolved").length;
  const recentSessions = sessions.slice(0, 4);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg shadow-teal-600/20">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute right-10 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <p className="text-teal-200 text-sm font-medium">{greeting} 👋</p>
          <h1
            className="text-2xl font-bold mt-0.5 mb-2"
            style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
          >
            {firstName}
          </h1>
          <p className="text-teal-100 text-sm max-w-sm">
            {patient
              ? "Your health companion is ready. Describe your symptoms anytime, in any language."
              : "Complete your profile to get personalized health guidance from VaidyaAI."}
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href="/dashboard/symptoms"
              className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-teal-50 transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Start consultation
            </Link>
            {!patient && (
              <Link
                href="/dashboard/patient-details"
                className="inline-flex items-center gap-2 bg-teal-500/40 hover:bg-teal-500/50 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors border border-white/20"
              >
                <User className="w-4 h-4" />
                Setup profile
              </Link>
            )}
          </div>
        </div>
        <Heart className="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 text-white/8 fill-white/8" />
      </div>

      {/* Profile incomplete warning */}
      {!patient && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">Profile not set up</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Add your medical details so VaidyaAI can give more accurate and personalised guidance.
            </p>
          </div>
          <Link
            href="/dashboard/patient-details"
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 whitespace-nowrap flex items-center gap-1 transition-colors"
          >
            Complete <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Sessions",
            value: totalSessions,
            icon: Activity,
            color: "text-teal-600",
            bg: "bg-teal-50",
            border: "border-teal-100",
          },
          {
            label: "Active",
            value: activeSessions,
            icon: Clock,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
          },
          {
            label: "Resolved",
            value: resolvedSessions,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
          },
          {
            label: "Languages",
            value: "20+",
            icon: Globe,
            color: "text-purple-600",
            bg: "bg-purple-50",
            border: "border-purple-100",
          },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <div
            key={label}
            className={`bg-white rounded-2xl border ${border} shadow-sm p-4`}
          >
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-4.5 h-4.5 ${color}`} />
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Recent sessions */}
        <div className="sm:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-700 text-sm">Recent Consultations</h2>
            <Link
              href="/dashboard/history"
              className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentSessions.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <MessageSquare className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No consultations yet</p>
              <Link
                href="/dashboard/symptoms"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-teal-600 font-semibold hover:text-teal-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Start your first
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentSessions.map((session) => (
                <Link
                  key={session.id}
                  href="/dashboard/symptoms"
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-8 h-8 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {session.title || "New consultation"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`severity-badge text-[10px] ${getSeverityColor(session.severity)}`}>
                        {session.severity}
                      </span>
                      <span className={`severity-badge text-[10px] ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatDate(session.created_at)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-400 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions & Patient snapshot */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                {
                  href: "/dashboard/symptoms",
                  icon: Plus,
                  label: "New consultation",
                  desc: "Describe symptoms now",
                  color: "bg-teal-600 text-white",
                },
                {
                  href: "/dashboard/patient-details",
                  icon: User,
                  label: "Update profile",
                  desc: "Medical details",
                  color: "bg-slate-100 text-slate-600",
                },
                {
                  href: "/dashboard/history",
                  icon: Clock,
                  label: "View history",
                  desc: "Past consultations",
                  color: "bg-slate-100 text-slate-600",
                },
              ].map(({ href, icon: Icon, label, desc, color }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:scale-[1.01] ${
                    color.includes("teal")
                      ? "bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold leading-none">{label}</p>
                    <p className={`text-[10px] mt-0.5 ${color.includes("teal") ? "text-teal-200" : "text-slate-400"}`}>
                      {desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Patient snapshot */}
          {patient && (
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-100 shadow-sm p-4">
              <h3 className="text-sm font-bold text-slate-700 mb-3">My Profile</h3>
              <div className="space-y-2">
                {[
                  { label: "Name", value: patient.full_name },
                  { label: "Age / Gender", value: `${patient.age}y · ${patient.gender}` },
                  patient.blood_group && { label: "Blood", value: patient.blood_group },
                  patient.village && { label: "Location", value: [patient.village, patient.district].filter(Boolean).join(", ") },
                ]
                  .filter(Boolean)
                  .map((item) => (
                    <div key={(item as { label: string }).label} className="flex items-baseline justify-between gap-2">
                      <span className="text-[10px] font-semibold text-teal-700 uppercase tracking-wide">
                        {(item as { label: string; value: string }).label}
                      </span>
                      <span className="text-xs text-slate-600 font-medium truncate max-w-[55%] text-right">
                        {(item as { label: string; value: string }).value}
                      </span>
                    </div>
                  ))}
              </div>
              <Link
                href="/dashboard/patient-details"
                className="mt-3 flex items-center justify-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-semibold transition-colors"
              >
                Edit profile <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
        <AlertTriangle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-500">Medical disclaimer:</strong> VaidyaAI provides
          general health information only. It is not a substitute for professional medical
          advice, diagnosis, or treatment. Always consult a qualified doctor for any medical
          concerns, especially in emergencies.
        </p>
      </div>
    </div>
  );
}
