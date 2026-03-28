"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ActionResult, PatientDetails } from "@/types";

export async function getPatientDetails(): Promise<PatientDetails | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("patient_details")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) return null;
  return data as PatientDetails;
}

export async function upsertPatientDetails(
  formData: FormData
): Promise<ActionResult<PatientDetails>> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated." };
  }

  const payload = {
    user_id: user.id,
    full_name: formData.get("full_name") as string,
    age: parseInt(formData.get("age") as string, 10),
    gender: formData.get("gender") as string,
    blood_group: formData.get("blood_group") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    village: formData.get("village") as string,
    district: formData.get("district") as string,
    state: formData.get("state") as string,
    country: (formData.get("country") as string) || "India",
    emergency_contact_name: formData.get("emergency_contact_name") as string,
    emergency_contact_phone: formData.get("emergency_contact_phone") as string,
    known_allergies: formData.get("known_allergies") as string,
    chronic_conditions: formData.get("chronic_conditions") as string,
    current_medications: formData.get("current_medications") as string,
    preferred_language: formData.get("preferred_language") as string || "en",
  };

  if (!payload.full_name || !payload.age || !payload.gender) {
    return { success: false, error: "Name, age and gender are required." };
  }

  const { data, error } = await supabase
    .from("patient_details")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/patient-details");
  return { success: true, data: data as PatientDetails };
}
