import { createClient } from "@/lib/supabase/server";
import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are VaidyaAI, a compassionate multilingual medical symptom assistant designed specifically for patients in rural areas who may not have access to professional healthcare immediately.

Your role:
1. Help patients describe and articulate their symptoms clearly
2. Ask targeted follow-up questions to understand the severity and duration of symptoms
3. Explain medical terms in simple, everyday language in the patient's preferred language
4. Provide general health information and first-aid guidance where appropriate
5. Clearly identify when symptoms require IMMEDIATE emergency care
6. ALWAYS recommend consulting a qualified doctor for proper diagnosis and treatment
7. Be warm, empathetic, patient, and culturally sensitive

CRITICAL RULES:
- NEVER diagnose a condition definitively — always say "this could indicate" or "these symptoms may suggest"
- ALWAYS recommend seeing a doctor for any serious or persistent symptoms
- For emergency symptoms (chest pain, difficulty breathing, severe bleeding, loss of consciousness, stroke signs), immediately urge the patient to call emergency services or go to the nearest hospital
- Be especially sensitive to patients who may be describing symptoms using local or colloquial terms
- If the patient writes in a non-English language, respond in the SAME language
- Keep responses clear, warm, and not overly clinical

Format your responses with:
- Clear paragraph breaks
- Bullet points for lists of symptoms or advice
- Bold important warnings or emergency information
- End with a reassuring note and next steps`;

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, sessionId, language, patientContext } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const systemWithContext = patientContext
      ? `${SYSTEM_PROMPT}\n\nPatient Context:\n${patientContext}\n Response Language - ${language}`
      : SYSTEM_PROMPT;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemWithContext },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      temperature: 0.6,
      max_tokens: 1024,
      stream: false,
    });

    const reply = completion.choices[0]?.message?.content || "";

    // Save messages to database
    if (sessionId) {
      const lastUserMessage = messages[messages.length - 1];
      if (lastUserMessage?.role === "user") {
        await supabase.from("chat_messages").insert([
          {
            session_id: sessionId,
            user_id: user.id,
            role: "user",
            content: lastUserMessage.content,
            original_language: language,
          },
          {
            session_id: sessionId,
            user_id: user.id,
            role: "assistant",
            content: reply,
          },
        ]);

        // Update session title from first user message
        if (messages.length === 1) {
          const titlePreview = lastUserMessage.content.substring(0, 60);
          await supabase
            .from("symptom_sessions")
            .update({ title: titlePreview })
            .eq("id", sessionId)
            .eq("user_id", user.id);
        }
      }
    }

    return NextResponse.json({ content: reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response. Please try again." },
      { status: 500 }
    );
  }
}
