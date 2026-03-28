export type Language = {
  code: string;
  name: string;
  nativeName: string;
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "tl", name: "Filipino", nativeName: "Filipino" },
];

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  preferred_language: string;
  role: "patient" | "doctor" | "admin";
  created_at: string;
  updated_at: string;
};

export type PatientDetails = {
  id: string;
  user_id: string;
  full_name: string;
  age: number;
  gender: "male" | "female" | "other" | "prefer_not_to_say";
  blood_group?: string;
  phone?: string;
  address?: string;
  village?: string;
  district?: string;
  state?: string;
  country: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  known_allergies?: string;
  chronic_conditions?: string;
  current_medications?: string;
  preferred_language: string;
  created_at: string;
  updated_at: string;
};

export type SymptomSession = {
  id: string;
  patient_id: string;
  user_id: string;
  title?: string;
  language: string;
  status: "active" | "resolved" | "referred";
  severity: "mild" | "moderate" | "severe" | "critical";
  summary?: string;
  ai_recommendation?: string;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  session_id: string;
  user_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  original_language?: string;
  translated_content?: string;
  created_at: string;
};

export type SymptomTag = {
  id: string;
  session_id: string;
  tag: string;
  severity_score: number;
  created_at: string;
};

export type ActionResult<T = void> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never };
