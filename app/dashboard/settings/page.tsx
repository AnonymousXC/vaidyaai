import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileSettingsClient from "./ProfileSettingsClient";
import { Settings } from "lucide-react";

export default async function ProfileSettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-teal-700" />
          </div>
          <h1 className="section-heading">Account Settings</h1>
        </div>
        <p className="text-sm text-slate-500 ml-11">
          Manage your account preferences and security settings.
        </p>
      </div>
      <ProfileSettingsClient
        userId={user.id}
        email={user.email || ""}
        initialName={profile?.full_name || user.user_metadata?.full_name || ""}
        initialLanguage={profile?.preferred_language || "en"}
      />
    </div>
  );
}
