-- ============================================================
-- Local Language Symptom Explainer — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en',
  role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PATIENT DETAILS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.patient_details (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER CHECK (age > 0 AND age < 150),
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  blood_group TEXT,
  phone TEXT,
  address TEXT,
  village TEXT,
  district TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  known_allergies TEXT,
  chronic_conditions TEXT,
  current_medications TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- SYMPTOM SESSIONS (each visit/complaint session)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.symptom_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES public.patient_details(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  language TEXT DEFAULT 'en',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'referred')),
  severity TEXT DEFAULT 'mild' CHECK (severity IN ('mild', 'moderate', 'severe', 'critical')),
  summary TEXT,
  ai_recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CHAT MESSAGES (per session)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES public.symptom_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  original_language TEXT,
  translated_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SYMPTOM TAGS (for quick symptom tagging)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.symptom_tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES public.symptom_sessions(id) ON DELETE CASCADE NOT NULL,
  tag TEXT NOT NULL,
  severity_score INTEGER DEFAULT 1 CHECK (severity_score BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_tags ENABLE ROW LEVEL SECURITY;

-- Profiles: users can view and edit own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Patient details
CREATE POLICY "Users can manage own patient details"
  ON public.patient_details FOR ALL USING (auth.uid() = user_id);

-- Symptom sessions
CREATE POLICY "Users can manage own sessions"
  ON public.symptom_sessions FOR ALL USING (auth.uid() = user_id);

-- Chat messages
CREATE POLICY "Users can manage own messages"
  ON public.chat_messages FOR ALL USING (auth.uid() = user_id);

-- Symptom tags
CREATE POLICY "Users can manage own tags"
  ON public.symptom_tags FOR ALL
  USING (
    session_id IN (
      SELECT id FROM public.symptom_sessions WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- FUNCTION: Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Trigger: on new auth user, create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FUNCTION: Update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_details_updated_at
  BEFORE UPDATE ON public.patient_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_symptom_sessions_updated_at
  BEFORE UPDATE ON public.symptom_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
