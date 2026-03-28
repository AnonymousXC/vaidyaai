"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { SUPPORTED_LANGUAGES } from "@/types";
import {
  User,
  Mail,
  Lock,
  Globe,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Trash2,
  AlertTriangle,
} from "lucide-react";

interface Props {
  userId: string;
  email: string;
  initialName: string;
  initialLanguage: string;
}

export default function ProfileSettingsClient({
  userId,
  email,
  initialName,
  initialLanguage,
}: Props) {
  const [name, setName] = useState(initialName);
  const [language, setLanguage] = useState(initialLanguage);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [profilePending, startProfileTransition] = useTransition();
  const [passwordPending, startPasswordTransition] = useTransition();
  const [profileSaved, setProfileSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all placeholder:text-slate-300";

  async function saveProfile() {
    startProfileTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: name, preferred_language: language })
        .eq("id", userId);

      if (error) {
        toast.error("Failed to update profile.");
      } else {
        setProfileSaved(true);
        toast.success("Profile updated!");
        setTimeout(() => setProfileSaved(false), 3000);
      }
    });
  }

  async function changePassword() {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    startPasswordTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
      }
    });
  }

  return (
    <div className="space-y-5">
      {/* Profile section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
          <User className="w-4 h-4 text-teal-600" />
          <h2 className="font-bold text-slate-700 text-sm">Profile Information</h2>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md shadow-teal-600/20">
            {name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?"}
          </div>
          <div>
            <p className="font-semibold text-slate-700 text-sm">{name || "No name set"}</p>
            <p className="text-xs text-slate-400 mt-0.5">{email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="field-label">Display name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className={`${inputCls} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className="field-label">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={email}
                disabled
                className={`${inputCls} pl-10 opacity-60 cursor-not-allowed`}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed here.</p>
          </div>

          <div>
            <label className="field-label">
              <Globe className="inline w-3.5 h-3.5 mr-1 text-teal-600" />
              Preferred language for AI responses
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={inputCls}
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
          {profileSaved && (
            <div className="flex items-center gap-1.5 text-teal-600 text-xs font-medium animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved!
            </div>
          )}
          <button
            onClick={saveProfile}
            disabled={profilePending}
            className="ml-auto flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all shadow-sm disabled:opacity-60"
          >
            {profilePending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            {profilePending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {/* Password section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
          <Lock className="w-4 h-4 text-teal-600" />
          <h2 className="font-bold text-slate-700 text-sm">Change Password</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="field-label">New password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                className={`${inputCls} pl-10 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="field-label">Confirm new password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPass ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className={`${inputCls} pl-10`}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-5 pt-4 border-t border-slate-100">
          <button
            onClick={changePassword}
            disabled={passwordPending || !newPassword || !confirmPassword}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all shadow-sm disabled:opacity-40"
          >
            {passwordPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            {passwordPending ? "Updating..." : "Update password"}
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-red-50">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <h2 className="font-bold text-red-600 text-sm">Danger Zone</h2>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-700">Delete account</p>
            <p className="text-xs text-slate-400 mt-0.5">
              This permanently deletes your account and all health records.
            </p>
          </div>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-shrink-0 flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 font-semibold px-3 py-1.5 rounded-lg text-xs transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          ) : (
            <div className="flex-shrink-0 flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-xs text-slate-500 hover:text-slate-700 font-medium transition-colors px-2"
              >
                Cancel
              </button>
              <button
                onClick={() => toast.error("Account deletion requires contacting support. This is a safety measure.")}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-all"
              >
                Confirm delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
