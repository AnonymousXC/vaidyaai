"use client";

import { useState, useTransition } from "react";
import { updatePassword } from "@/lib/actions/auth";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [show, setShow] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const result = await updatePassword(formData);
      if (result && !result.success) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="auth-card p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "var(--font-lora)" }}>
          Set new password
        </h2>
        <p className="text-slate-500 text-sm mt-1">Choose a strong password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {["password", "confirm"].map((name) => (
          <div key={name}>
            <label className="field-label">
              {name === "password" ? "New password" : "Confirm password"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name={name}
                type={show ? "text" : "password"}
                required
                minLength={8}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all placeholder:text-slate-300"
              />
              {name === "password" && (
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 disabled:opacity-60"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isPending ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}
