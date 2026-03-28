"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { signUp } from "@/lib/actions/auth";
import { Eye, EyeOff, Mail, Lock, User, Loader2, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm_password") as string;

    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const result = await signUp(formData);
      if (!result.success) {
        toast.error(result.error);
      } else {
        setSuccess(true);
      }
    });
  }

  if (success) {
    return (
      <div className="auth-card p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-16 h-16 text-teal-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: "var(--font-lora)" }}>
          Check your email
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          We sent a verification link to your email. Click it to activate your account.
        </p>
        <Link
          href="/login"
          className="inline-block bg-teal-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-teal-700 transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-card p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "var(--font-lora)" }}>
          Create your account
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Start your health journey with VaidyaAI
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="field-label">Full name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              name="full_name"
              type="text"
              required
              placeholder="Ravi Kumar"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        <div>
          <label className="field-label">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        <div>
          <label className="field-label">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="Min 8 characters"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all placeholder:text-slate-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="field-label">Confirm password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              name="confirm_password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Re-enter password"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
