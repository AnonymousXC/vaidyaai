export default function DashboardLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      {/* Banner skeleton */}
      <div className="h-36 bg-slate-100 rounded-2xl" />

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100 shadow-sm" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 h-64 bg-white rounded-2xl border border-slate-100 shadow-sm" />
        <div className="space-y-4">
          <div className="h-40 bg-white rounded-2xl border border-slate-100 shadow-sm" />
          <div className="h-36 bg-white rounded-2xl border border-slate-100 shadow-sm" />
        </div>
      </div>
    </div>
  );
}
