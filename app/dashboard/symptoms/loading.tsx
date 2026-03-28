export default function SymptomsLoading() {
  return (
    <div className="flex h-[calc(100vh-7.5rem)] gap-4 animate-pulse">
      {/* Sidebar skeleton */}
      <div className="w-72 flex-shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
        <div className="flex justify-between items-center mb-2">
          <div className="h-4 w-28 bg-slate-100 rounded-lg" />
          <div className="h-7 w-16 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-8 bg-slate-50 rounded-lg" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-50 rounded-xl" />
        ))}
      </div>

      {/* Chat skeleton */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
        <div className="h-14 border-b border-slate-100 px-5 flex items-center gap-3">
          <div className="h-4 w-40 bg-slate-100 rounded-lg" />
        </div>
        <div className="flex-1 p-5 space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex-shrink-0" />
            <div className="h-20 w-64 bg-slate-100 rounded-2xl rounded-tl-sm" />
          </div>
          <div className="flex gap-3 flex-row-reverse">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex-shrink-0" />
            <div className="h-12 w-48 bg-teal-50 rounded-2xl rounded-tr-sm" />
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex-shrink-0" />
            <div className="h-28 w-80 bg-slate-100 rounded-2xl rounded-tl-sm" />
          </div>
        </div>
        <div className="h-20 border-t border-slate-100 p-4">
          <div className="h-full bg-slate-50 rounded-2xl border border-slate-200" />
        </div>
      </div>
    </div>
  );
}
