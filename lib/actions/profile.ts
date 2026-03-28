"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types";

export async function getProfile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const full_name = formData.get("full_name") as string;
  const preferred_language = formData.get("preferred_language") as string;

  const { error } = await supabase
    .from("profiles")
    .update({ full_name, preferred_language })
    .eq("id", user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/settings");
  return { success: true, data: undefined };
}

export async function getDashboardStats() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ count: total }, { count: active }, { count: resolved }] =
    await Promise.all([
      supabase
        .from("symptom_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("symptom_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "active"),
      supabase
        .from("symptom_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "resolved"),
    ]);

  return { total: total ?? 0, active: active ?? 0, resolved: resolved ?? 0 };
}
