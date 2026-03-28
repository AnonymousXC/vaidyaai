# 🏥 VaidyaAI — Local Language Symptom Explainer

A full-stack Next.js healthcare application that helps patients in rural areas describe their symptoms in their native language and receive clear, compassionate AI-powered health guidance.

---

## ✨ Features

- **20+ Language Support** — Patients can type in Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, English, Spanish, Arabic, Swahili, and many more
- **AI Symptom Chat** — Powered by Groq's LLaMA 3.3 70B model for fast, multilingual responses
- **Patient Profile** — Comprehensive medical profile including allergies, chronic conditions, medications, and location
- **Consultation History** — Browse and resume past symptom sessions
- **Emergency Guidance** — AI recognizes emergency symptoms and urges immediate care
- **Supabase Auth** — Full authentication: signup, login, forgot password, email verification
- **Row-Level Security** — Each patient sees only their own data

---

## 🗂️ Project Structure

```
symptom-explainer/
├── app/
│   ├── (auth)/               # Auth pages (login, signup, forgot-password)
│   ├── (dashboard)/          # Protected dashboard pages
│   │   ├── patient-details/  # Patient profile form
│   │   ├── symptoms/         # AI chat interface
│   │   └── history/          # Consultation history
│   ├── api/
│   │   └── chat/             # Groq API route
│   └── auth/
│       ├── callback/          # OAuth / email verification callback
│       └── reset-password/   # Password reset page
├── components/
│   ├── ui/                   # shadcn/ui components
│   └── custom/               # App-specific components
├── lib/
│   ├── actions/              # Server Actions
│   │   ├── auth.ts           # Auth: signIn, signUp, signOut, forgotPassword
│   │   ├── patient.ts        # Patient CRUD
│   │   └── symptoms.ts       # Session & message management
│   ├── supabase/
│   │   ├── client.ts         # Browser Supabase client
│   │   └── server.ts         # Server Supabase client
│   └── utils/                # Utility functions
├── supabase/
│   └── schema.sql            # Full DB schema + RLS policies
├── types/
│   └── index.ts              # TypeScript types
└── middleware.ts             # Auth protection middleware
```

---

## 🚀 Getting Started

### 1. Clone and install

```bash
git clone <your-repo>
cd symptom-explainer
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full contents of `supabase/schema.sql`
3. Go to **Authentication → URL Configuration** and set:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 3. Get your Groq API key

1. Sign up at [console.groq.com](https://console.groq.com)
2. Create an API key

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=gsk_your_groq_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🛣️ Routes

| Route | Description |
|-------|-------------|
| `/` | Redirects to login or dashboard |
| `/signup` | Create a new account |
| `/login` | Sign in |
| `/forgot-password` | Request password reset email |
| `/auth/callback` | Supabase OAuth / email verification callback |
| `/auth/reset-password` | Set a new password |
| `/dashboard/symptoms` | Main AI symptom chat interface |
| `/dashboard/patient-details` | View/edit patient medical profile |
| `/dashboard/history` | Browse past consultations |
| `/api/chat` | POST — Groq AI chat endpoint |

---

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (auto-created on signup) |
| `patient_details` | Full medical profile (1:1 with profile) |
| `symptom_sessions` | Each consultation session |
| `chat_messages` | Messages within a session |
| `symptom_tags` | Symptom tags for sessions |

---

## 🔐 Security

- Row-Level Security (RLS) on all tables
- Server Actions validate authentication before every DB operation
- Middleware protects all `/dashboard/*` routes
- Groq API key is server-side only (never exposed to client)

---

## 🌐 Supported Languages

Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Urdu, Odia, Assamese, English, Spanish, French, Arabic, Swahili, Portuguese, Indonesian, Filipino — and the AI can understand many more.

---

## ⚠️ Medical Disclaimer

VaidyaAI provides general health information only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
