/**
 * components/ChatWidget.jsx
 * ──────────────────────────────────────────────────────────────────────────
 * Floating AI counsellor chatbot powered by RAG + Gemini 1.5 Flash.
 * Always visible as a floating button; slides open as a chat panel.
 */
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";

// ── Suggestion chips shown in empty state ──────────────────────────────────
const SUGGESTIONS = [
  "Which scholarship is best for rural girls?",
  "I'm OBC with 7.5 GPA. What can I get?",
  "Which scholarship has the highest amount?",
  "Documents needed for NSP scholarship?",
  "Best scholarship for SC students under ₹2L income?",
];

// ── Individual message bubble ─────────────────────────────────────────────
function Bubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"} mb-3`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm
                       ${isUser ? "bg-indigo-600 text-white" : "bg-gradient-to-br from-violet-500 to-indigo-600 text-white"}`}
      >
        {isUser ? "👤" : "🤖"}
      </div>
      {/* Bubble */}
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                       ${
                         isUser
                           ? "bg-indigo-600 text-white rounded-tr-sm"
                           : "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 rounded-tl-sm shadow-sm"
                       }`}
      >
        {msg.content}
        {msg.mode && msg.mode !== "user" && (
          <div className="text-[10px] mt-1 opacity-50">
            via {msg.mode} · {msg.sources_used} sources
          </div>
        )}
      </div>
    </div>
  );
}

// ── Typing indicator ───────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm flex-shrink-0">
        🤖
      </div>
      <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 150, 300].map((d) => (
            <span
              key={d}
              className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
              style={{ animationDelay: `${d}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main widget ────────────────────────────────────────────────────────────
export default function ChatWidget({ studentProfile }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm ScholarMatch AI — your scholarship counsellor.\n\nAsk me anything about scholarships, eligibility, documents, or deadlines. I can also personalise advice once you've submitted your profile!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");

    // Add user bubble
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", {
        message: msg,
        studentProfile: studentProfile || null,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.response,
          sources_used: res.data.sources_used,
          mode: res.data.mode,
        },
      ]);
    } catch (e) {
      const errMsg =
        e.response?.data?.message || "Something went wrong. Please try again.";
      showToast(errMsg, "error");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ " + errMsg },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearChat = () =>
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! Ask me anything about scholarships. 🎓",
      },
    ]);

  return (
    <>
      {/* ── Floating trigger button ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl
                    flex items-center justify-center text-2xl
                    bg-gradient-to-br from-indigo-600 to-violet-600 text-white
                    hover:scale-110 active:scale-95 transition-all duration-200
                    ${open ? "rotate-180" : ""}`}
        title="Ask ScholarMatch AI"
        aria-label="Open AI chat"
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* Badge for unread */}
      {!open && (
        <span
          className="fixed bottom-[72px] right-6 z-50 w-5 h-5 rounded-full bg-red-500 text-white
                         text-[10px] font-bold flex items-center justify-center animate-pulse"
        >
          AI
        </span>
      )}

      {/* ── Chat panel ── */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)]
                        bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border
                        border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden
                        animate-fade-slide-up"
          style={{ height: "520px" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">
              🤖
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">
                ScholarMatch AI
              </p>
              <p className="text-white/70 text-xs">RAG-powered counsellor</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] text-white/80 bg-white/10 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
              <button
                onClick={clearChat}
                title="Clear chat"
                className="text-white/60 hover:text-white text-xs px-1"
              >
                🗑
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-slate-50 dark:bg-slate-900/50">
            {messages.map((m, i) => (
              <Bubble key={i} msg={m} />
            ))}
            {loading && <TypingDots />}
            <div ref={bottomRef} />
          </div>

          {/* Suggestion chips (shown only on first load / no user message yet) */}
          {messages.length <= 1 && !loading && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] px-2.5 py-1 rounded-full
                             bg-indigo-50 dark:bg-indigo-900/40
                             text-indigo-700 dark:text-indigo-300
                             border border-indigo-200 dark:border-indigo-700
                             hover:bg-indigo-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="px-3 py-3 border-t border-slate-200 dark:border-slate-700 flex gap-2 bg-white dark:bg-slate-800">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about scholarships…"
              className="flex-1 resize-none text-sm px-3 py-2 rounded-xl border border-slate-200
                         dark:border-slate-600 bg-slate-50 dark:bg-slate-700
                         text-slate-800 dark:text-slate-100 placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-300
                         dark:focus:ring-indigo-700 transition-all"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center
                         hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed
                         transition-colors flex-shrink-0 self-end"
            >
              {loading ? (
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <span className="text-sm">➤</span>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
