/**
 * components/ScholarshipCard.jsx
 * --------------------------------
 * Renders a single scholarship result.
 *
 * Props:
 *   scholarship — { id, name, provider, amount, match_score }
 *   index       — 0 | 1 | 2  (used for staggered animation delay)
 */

const ANIMATION_CLASSES = [
  "animate-fade-slide-up-1",
  "animate-fade-slide-up-2",
  "animate-fade-slide-up-3",
];

/** Map a match score to a human-readable label + colour */
function getMatchLabel(score) {
  if (score >= 0.95)
    return {
      label: "Excellent Match",
      color: "text-emerald-600 bg-emerald-50",
    };
  if (score >= 0.85)
    return { label: "Strong Match", color: "text-indigo-600 bg-indigo-50" };
  return { label: "Good Match", color: "text-violet-600 bg-violet-50" };
}

/** Format a number as Indian currency string */
function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ScholarshipCard({ scholarship, index }) {
  const { name, provider, amount, match_score } = scholarship;
  const pct = Math.round(match_score * 100);
  const { label, color } = getMatchLabel(match_score);
  const animClass = ANIMATION_CLASSES[index] ?? "animate-fade-slide-up-1";

  return (
    <div className={`scholarship-card ${animClass}`}>
      {/* Top row: rank badge + match label */}
      <div className="flex items-start justify-between mb-4">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-200 flex-shrink-0">
          #{index + 1}
        </span>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color}`}
        >
          {label}
        </span>
      </div>

      {/* Scholarship name */}
      <h3 className="text-base font-bold text-slate-800 leading-snug mb-1">
        {name}
      </h3>

      {/* Provider */}
      <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
        <span>🏛️</span> {provider}
      </p>

      {/* Amount */}
      <div className="mb-4">
        <span className="text-2xl font-extrabold text-emerald-600">
          {formatINR(amount)}
        </span>
        <span className="text-slate-400 text-xs ml-1 font-normal">/ year</span>
      </div>

      {/* Match score progress bar */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-slate-500 font-medium">
            AI Match Score
          </span>
          <span className="text-xs font-bold text-indigo-600">{pct}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-indigo-100 overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
