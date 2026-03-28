import { getSessions } from "@/lib/actions/symptoms";
import Link from "next/link";
import { formatDate, formatTime, getSeverityColor, getStatusColor } from "@/lib/utils";
import { History, MessageSquare, Clock, ChevronRight, Inbox } from "lucide-react";

export default async function HistoryPage() {
  const sessions = await getSessions();

  const grouped = sessions.reduce(
    (acc, session) => {
      const date = formatDate(session.created_at);
      if (!acc[date]) acc[date] = [];
      acc[date].push(session);
      return acc;
    },
    {} as Record<string, typeof sessions>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
            <History className="w-4 h-4 text-teal-700" />
          </div>
          <h1 className="section-heading">Consultation History</h1>
        </div>
        <p className="text-sm text-slate-500 ml-11">
          All your past health consultations with VaidyaAI.
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <Inbox className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <h3
            className="text-lg font-bold text-slate-700 mb-1"
            style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
          >
            No consultations yet
          </h3>
          <p className="text-slate-400 text-sm mb-5">
            Start your first symptom consultation to see it here.
          </p>
          <Link
            href="/dashboard/symptoms"
            className="inline-flex items-center gap-2 bg-teal-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors text-sm shadow-md shadow-teal-600/20"
          >
            <MessageSquare className="w-4 h-4" />
            Start consultation
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, daySessions]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Clock className="w-3.5 h-3.5" />
                  {date}
                </div>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              <div className="space-y-2">
                {daySessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/dashboard/symptoms`}
                    className="flex items-center gap-4 bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3.5 hover:border-teal-100 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4.5 h-4.5 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">
                        {session.title || "Consultation"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`severity-badge text-[10px] ${getSeverityColor(session.severity)}`}
                        >
                          {session.severity}
                        </span>
                        <span
                          className={`severity-badge text-[10px] ${getStatusColor(session.status)}`}
                        >
                          {session.status}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatTime(session.created_at)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-400 transition-colors flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {sessions.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            {
              label: "Total",
              value: sessions.length,
              color: "text-teal-700",
              bg: "bg-teal-50",
            },
            {
              label: "Active",
              value: sessions.filter((s) => s.status === "active").length,
              color: "text-blue-700",
              bg: "bg-blue-50",
            },
            {
              label: "Resolved",
              value: sessions.filter((s) => s.status === "resolved").length,
              color: "text-emerald-700",
              bg: "bg-emerald-50",
            },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className={`${bg} rounded-xl p-4 text-center border border-white shadow-sm`}
            >
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
