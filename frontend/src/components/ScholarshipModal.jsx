/**
 * components/ScholarshipModal.jsx
 * --------------------------------
 * Expanded scholarship detail modal.
 * Props: scholarship (full object), onClose
 */
import { useTranslation } from "react-i18next";

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

export default function ScholarshipModal({ scholarship, onClose }) {
  const { t } = useTranslation();
  if (!scholarship) return null;
  const {
    name,
    provider,
    category,
    amount,
    match_score,
    deadline,
    days_left,
    apply_url,
    documents_required,
    eligibility_criteria,
    explanation,
  } = scholarship;

  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full
                      max-h-[90vh] overflow-y-auto p-8 animate-fade-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-900 px-2 py-0.5 rounded-full">
              {category}
            </span>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mt-2">
              {name}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1 mt-1">
              🏛️ {provider}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-bold leading-none flex-shrink-0 ml-4"
          >
            ×
          </button>
        </div>

        {/* Amount + Deadline */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="glass-card flex-1 p-4 text-center">
            <div className="text-2xl font-extrabold text-emerald-600">
              {formatINR(amount)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {t("amount_year")}
            </div>
          </div>
          <div className="glass-card flex-1 p-4 text-center">
            <div className="text-lg font-bold text-slate-700 dark:text-white">
              {deadline}
            </div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <DeadlineBadge daysLeft={days_left} t={t} />
              <span className="text-xs text-slate-400">
                {days_left} {t("days_left")}
              </span>
            </div>
          </div>
          <div className="glass-card flex-1 p-4 text-center">
            <div className="text-2xl font-extrabold text-indigo-600">
              {Math.round(match_score * 100)}%
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {t("match_score")}
            </div>
          </div>
        </div>

        {/* XAI Explanation */}
        <div className="mb-5">
          <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-lg">🧠</span> {t("xai_title")}
          </h4>
          <ul className="space-y-1.5">
            {explanation.map((e, i) => (
              <li
                key={i}
                className={`text-sm px-3 py-2 rounded-lg font-medium ${
                  e.startsWith("✓")
                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : e.startsWith("✗")
                      ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                }`}
              >
                {e}
              </li>
            ))}
          </ul>
        </div>

        {/* Eligibility */}
        <div className="mb-5">
          <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-lg">✅</span> {t("eligibility")}
          </h4>
          <ul className="space-y-1">
            {eligibility_criteria.map((c, i) => (
              <li
                key={i}
                className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Documents */}
        <div className="mb-6">
          <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-lg">📄</span> {t("documents")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {documents_required.map((d, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium"
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Fairness note */}
        <div className="text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 mb-5 flex items-start gap-2">
          <span>⚖️</span>
          <span>
            This recommendation is generated by a bias-audited AI model. Gender
            is used only when the scholarship explicitly requires it.
          </span>
        </div>

        {/* CTA */}
        <a
          href={apply_url}
          target="_blank"
          rel="noreferrer"
          className="btn-primary text-center block"
        >
          {t("apply_now")}
        </a>
      </div>
    </div>
  );
}
