"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ActionResult, SymptomSession, ChatMessage } from "@/types";

export async function createSession(
  language: string = "en",
  title: string = "New Consultation"
): Promise<ActionResult<SymptomSession>> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  // Get patient record
  const { data: patient } = await supabase
    .from("patient_details")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!patient) {
    return {
      success: false,
      error: "Please complete your patient details first.",
    };
  }

  const { data, error } = await supabase
    .from("symptom_sessions")
    .insert({
      patient_id: patient.id,
      user_id: user.id,
      title,
      language,
      status: "active",
      severity: "mild",
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/symptoms");
  return { success: true, data: data as SymptomSession };
}

export async function getSessions(): Promise<SymptomSession[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("symptom_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data as SymptomSession[]) || [];
}

export async function getSession(sessionId: string): Promise<SymptomSession | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("symptom_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  return (data as SymptomSession) || null;
}

export async function updateSessionStatus(
  sessionId: string,
  status: "active" | "resolved" | "referred",
  severity?: "mild" | "moderate" | "severe" | "critical"
): Promise<ActionResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const update: Record<string, string> = { status };
  if (severity) update.severity = severity;

  const { error } = await supabase
    .from("symptom_sessions")
    .update(update)
    .eq("id", sessionId)
    .eq("user_id", user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/symptoms");
  return { success: true, data: undefined };
}

export async function getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  return (data as ChatMessage[]) || [];
}

export async function saveMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string,
  originalLanguage?: string
): Promise<ActionResult<ChatMessage>> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      session_id: sessionId,
      user_id: user.id,
      role,
      content,
      original_language: originalLanguage,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as ChatMessage };
}

export async function deleteSession(sessionId: string): Promise<ActionResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const { error } = await supabase
    .from("symptom_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("user_id", user.id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/symptoms");
  return { success: true, data: undefined };
}
