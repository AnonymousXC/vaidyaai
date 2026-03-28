"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-100 shadow-lg p-8 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-2" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>
            Something went wrong
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            An unexpected error occurred. Please try refreshing or return to the home page.
          </p>
          {error.digest && (
            <p className="text-xs text-slate-400 font-mono mb-4 bg-slate-50 rounded-lg px-3 py-2">
              Error: {error.digest}
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 bg-teal-600 text-white font-semibold px-5 py-2 rounded-xl hover:bg-teal-700 transition-colors text-sm shadow-md shadow-teal-600/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try again
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 border border-slate-200 text-slate-600 font-semibold px-5 py-2 rounded-xl hover:bg-slate-50 transition-colors text-sm"
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
