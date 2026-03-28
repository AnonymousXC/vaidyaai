"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  createSession,
  getSessionMessages,
  deleteSession,
} from "@/lib/actions/symptoms";
import { SymptomSession, ChatMessage, PatientDetails, SUPPORTED_LANGUAGES } from "@/types";
import {
  MessageSquare,
  Plus,
  Send,
  Trash2,
  Globe,
  Loader2,
  Bot,
  User,
  AlertCircle,
  Clock,
  ChevronDown,
} from "lucide-react";
import { formatDate, formatTime, getSeverityColor, getStatusColor } from "@/lib/utils";

interface Props {
  initialSessions: SymptomSession[];
  patient: PatientDetails;
  patientContext: string;
}

type Message = { role: "user" | "assistant"; content: string };

export default function SymptomsClient({ initialSessions, patient, patientContext }: Props) {
  const [sessions, setSessions] = useState<SymptomSession[]>(initialSessions);
  const [activeSession, setActiveSession] = useState<SymptomSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedLang, setSelectedLang] = useState(patient.preferred_language || "en");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const loadSession = useCallback(async (session: SymptomSession) => {
    setActiveSession(session);
    setLoadingMessages(true);
    setMessages([]);
    try {
      const msgs = await getSessionMessages(session.id);
      setMessages(
        msgs
          .filter((m) => m.role !== "system")
          .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }))
      );
    } catch {
      toast.error("Failed to load messages.");
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  async function handleNewSession() {
    setIsCreating(true);
    try {
      const result = await createSession(selectedLang);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      const newSession = result.data!;
      setSessions((prev) => [newSession, ...prev]);
      setActiveSession(newSession);
      setMessages([]);
      toast.success("New consultation started");
    } catch {
      toast.error("Failed to create session.");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(sessionId: string, e: React.MouseEvent) {
    e.stopPropagation();
    const result = await deleteSession(sessionId);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSession?.id === sessionId) {
      setActiveSession(null);
      setMessages([]);
    }
    toast.success("Session deleted.");
  }

  async function handleSend() {
    if (!input.trim() || !activeSession) return;
    const userMsg = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const updatedMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          sessionId: activeSession.id,
          language: selectedLang,
          patientContext,
        }),
      });

      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      const aiMessage: Message = { role: "assistant", content: data.content };
      setMessages((prev) => [...prev, aiMessage]);

      // Update session title in sidebar
      if (messages.length === 0) {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSession.id
              ? { ...s, title: userMsg.substring(0, 55) + (userMsg.length > 55 ? "…" : "") }
              : s
          )
        );
      }
    } catch {
      toast.error("Failed to get AI response. Please try again.");
      setMessages((prev) => prev.slice(0, -1));
      setInput(userMsg);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTextareaInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  }

  const langName = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.nativeName || "English";

  return (
    <div className="flex h-[calc(100vh-7.5rem)] gap-4">
      {/* Sessions sidebar */}
      <div className="w-72 flex-shrink-0 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-700 text-sm">Consultations</h2>
          <button
            onClick={handleNewSession}
            disabled={isCreating}
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-60 shadow-sm"
          >
            {isCreating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            New
          </button>
        </div>

        {/* Language picker */}
        <div className="px-3 py-2 border-b border-slate-50">
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-2 py-1.5">
            <Globe className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="flex-1 bg-transparent text-xs text-slate-600 focus:outline-none font-medium"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.length === 0 ? (
            <div className="text-center py-10 px-4">
              <MessageSquare className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No consultations yet. Start one!</p>
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => loadSession(session)}
                className={`w-full text-left p-3 rounded-xl transition-all group relative ${
                  activeSession?.id === session.id
                    ? "bg-teal-50 border border-teal-100"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-700 leading-tight line-clamp-2 flex-1">
                    {session.title || "New consultation"}
                  </p>
                  <button
                    onClick={(e) => handleDelete(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-slate-300 hover:text-red-500 transition-all mt-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`severity-badge text-[10px] ${getSeverityColor(session.severity)}`}>
                    {session.severity}
                  </span>
                  <span className={`severity-badge text-[10px] ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  {formatDate(session.created_at)}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat panel */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {!activeSession ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center mb-5 shadow-inner">
              <Bot className="w-10 h-10 text-teal-500" />
            </div>
            <h2
              className="text-xl font-bold text-slate-800 mb-2"
              style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
            >
              Start a consultation
            </h2>
            <p className="text-slate-400 text-sm max-w-sm mb-6">
              Describe your symptoms in <strong>{langName}</strong> or any language you're
              comfortable with. VaidyaAI understands 20+ languages.
            </p>
            <button
              onClick={handleNewSession}
              disabled={isCreating}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-teal-600/20 disabled:opacity-60"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Start new consultation
            </button>

            <div className="mt-8 grid grid-cols-2 gap-3 max-w-sm w-full">
              {[
                "मुझे सिर दर्द और बुखार है",
                "I have chest pain since morning",
                "पेट में बहुत दर्द हो रहा है",
                "My child has a rash on the skin",
              ].map((example) => (
                <button
                  key={example}
                  onClick={async () => {
                    if (!activeSession) {
                      const result = await createSession(selectedLang);
                      if (result.success) {
                        setSessions((prev) => [result.data!, ...prev]);
                        setActiveSession(result.data!);
                        setMessages([]);
                        setInput(example);
                        setTimeout(() => textareaRef.current?.focus(), 100);
                      }
                    }
                  }}
                  className="text-left text-xs bg-slate-50 hover:bg-teal-50 border border-slate-100 hover:border-teal-100 text-slate-600 hover:text-teal-700 px-3 py-2.5 rounded-xl transition-all leading-snug"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-700 text-sm line-clamp-1">
                  {activeSession.title || "Consultation"}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <Globe className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">{langName}</span>
                  <span className="text-slate-200">·</span>
                  <span className={`severity-badge text-[10px] ${getSeverityColor(activeSession.severity)}`}>
                    {activeSession.severity}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1">
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                  <span className="text-[10px] font-semibold text-amber-600">
                    Not a substitute for medical care
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-5 h-5 text-teal-500 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-sm text-slate-400">
                    Describe your symptoms to begin. You can type in{" "}
                    <strong>{langName}</strong>.
                  </p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 animate-message-in ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                        msg.role === "user"
                          ? "bg-teal-600 text-white"
                          : "bg-teal-50 border border-teal-100"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4 text-teal-600" />
                      )}
                    </div>
                    <div
                      className={
                        msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                      }
                    >
                      {msg.role === "assistant" ? (
                        <div
                          className="text-sm leading-relaxed prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-slate-800 prose-strong:text-slate-800 prose-li:text-slate-700"
                          dangerouslySetInnerHTML={{
                            __html: formatMarkdown(msg.content),
                          }}
                        />
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex gap-3 animate-message-in">
                  <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="chat-bubble-ai flex items-center gap-1.5 py-4">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-slate-100">
              <div className="flex items-end gap-3 bg-slate-50 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-teal-300 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleTextareaInput}
                  onKeyDown={handleKeyDown}
                  placeholder={`Describe your symptoms in ${langName}…`}
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                  style={{ maxHeight: "120px" }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="flex-shrink-0 w-8 h-8 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl flex items-center justify-center transition-all shadow-sm disabled:shadow-none"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                Press Enter to send · Shift+Enter for new line
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^### (.*$)/gm, "<h4 class='font-semibold text-slate-800 mt-3 mb-1'>$1</h4>")
    .replace(/^## (.*$)/gm, "<h3 class='font-bold text-slate-800 mt-3 mb-1.5'>$1</h3>")
    .replace(/^- (.*$)/gm, "<li class='ml-4 list-disc'>$1</li>")
    .replace(/(<li.*<\/li>\n?)+/g, "<ul class='my-2 space-y-1'>$&</ul>")
    .replace(/\n\n/g, "</p><p class='mt-2'>")
    .replace(/\n/g, "<br/>")
    .replace(/^(.+)$/, "<p>$1</p>");
}
