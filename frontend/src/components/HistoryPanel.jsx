/**
 * components/HistoryPanel.jsx
 * ----------------------------
 * Collapsible panel showing last 10 searches from MongoDB.
 * One-click re-run restores a previous profile.
 */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function HistoryPanel({ onRerun }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    axios
      .get("/api/history")
      .then((r) => setHistory(r.data.history || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="glass-card mb-6">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
          🕐 {t("history_title")}
        </span>
        <span
          className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="px-6 pb-5">
          {loading ? (
            <div className="text-center text-slate-400 py-4 text-sm">
              Loading…
            </div>
          ) : history.length === 0 ? (
            <div className="text-center text-slate-400 py-4 text-sm">
              No searches yet.
            </div>
          ) : (
            <ul className="space-y-2">
              {history.map((h) => (
                <li
                  key={h._id}
                  className="flex items-center justify-between p-3 rounded-xl
                                            bg-slate-50 dark:bg-slate-700/50 hover:bg-indigo-50
                                            dark:hover:bg-indigo-900/20 transition-colors"
                >
                  <div>
                    <div className="font-semibold text-sm text-slate-800 dark:text-white">
                      {h.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      GPA {h.gpa} · ₹{h.income?.toLocaleString("en-IN")} ·{" "}
                      {h.caste} · {h.region}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {formatDate(h.createdAt)}
                    </div>
                  </div>
                  <button
                    onClick={() => onRerun(h)}
                    className="text-xs text-indigo-600 font-semibold hover:underline ml-4 flex-shrink-0"
                  >
                    Re-run →
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
