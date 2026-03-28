import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-pattern flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative z-10 text-center max-w-md animate-fade-in">
        {/* Big 404 */}
        <div className="relative mb-8">
          <p
            className="text-[120px] font-bold leading-none select-none"
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #5eead4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-12 h-12 text-teal-200 opacity-40 mt-4" />
          </div>
        </div>

        <h1
          className="text-2xl font-bold text-slate-800 mb-3"
          style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
        >
          Page not found
        </h1>
        <p className="text-slate-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-teal-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-all shadow-md shadow-teal-600/20 text-sm"
          >
            <Home className="w-4 h-4" />
            Go to dashboard
          </Link>
          <Link
            href="/dashboard/symptoms"
            className="inline-flex items-center gap-2 border border-teal-200 text-teal-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-50 transition-colors text-sm"
          >
            Start consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
