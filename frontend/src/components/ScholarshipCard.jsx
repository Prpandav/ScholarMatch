/**
 * components/ScholarshipCard.jsx — v2
 * Full card with deadline urgency badge + click to expand modal.
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ScholarshipModal from "./ScholarshipModal";

function DeadlineBadge({ daysLeft, t }) {
  if (daysLeft <= 7)
    return (
      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
        🔴 {t("urgent")}
      </span>
    );
  if (daysLeft <= 30)
    return (
      <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
        🟡 {t("closing_soon")}
      </span>
    );
  return (
    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
      🟢 {t("open")}
    </span>
  );
}

const MATCH_LABELS = [
  {
    min: 0.85,
    label: "Excellent Match",
    color: "bg-emerald-100 text-emerald-700",
  },
  { min: 0.7, label: "Great Match", color: "bg-blue-100 text-blue-700" },
  { min: 0.5, label: "Good Match", color: "bg-violet-100 text-violet-700" },
  { min: 0, label: "Partial Match", color: "bg-slate-100 text-slate-600" },
];

export default function ScholarshipCard({ scholarship, index }) {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const {
    name,
    provider,
    category,
    amount,
    match_score,
    deadline,
    days_left,
    explanation,
  } = scholarship;

  const pct = Math.round(match_score * 100);
  const { label, color } = MATCH_LABELS.find((m) => pct / 100 >= m.min);
  const animClass = `animate-fade-slide-up`;

  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <>
      <div
        className={`scholarship-card cursor-pointer ${animClass}`}
        style={{ animationDelay: `${index * 100}ms` }}
        onClick={() => setModalOpen(true)}
      >
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600
                           text-white text-xs font-bold shadow-md shadow-indigo-200 flex-shrink-0"
          >
            #{index + 1}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <DeadlineBadge daysLeft={days_left} t={t} />
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color}`}
            >
              {label}
            </span>
          </div>
        </div>

        {/* Name + provider */}
        <h3 className="text-base font-bold text-slate-800 dark:text-white leading-snug mb-0.5">
          {name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
          🏛️ {provider}
        </p>
        <span
          className="inline-block text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600
                         dark:bg-indigo-900 dark:text-indigo-300 mb-3 font-medium"
        >
          {category}
        </span>

        {/* Amount */}
        <div className="mb-3">
          <span className="text-2xl font-extrabold text-emerald-600">
            {formatINR(amount)}
          </span>
          <span className="text-slate-400 text-xs ml-1 font-normal">
            {t("amount_year")}
          </span>
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
          <span>📅 {deadline}</span>
          <span>·</span>
          <span className="font-semibold">
            {days_left} {t("days_left")}
          </span>
        </div>

        {/* Match score bar */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t("match_score")}
            </span>
            <span className="text-xs font-bold text-indigo-600">{pct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-indigo-100 dark:bg-indigo-900 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Top explanation preview */}
        {explanation?.[0] && (
          <div
            className={`mt-3 text-xs px-3 py-2 rounded-lg font-medium ${
              explanation[0].startsWith("✓")
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
            }`}
          >
            {explanation[0]}
          </div>
        )}

        <p className="text-xs text-indigo-500 dark:text-indigo-400 text-center mt-3 font-medium">
          Click for full details →
        </p>
      </div>

      {modalOpen && (
        <ScholarshipModal
          scholarship={scholarship}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
