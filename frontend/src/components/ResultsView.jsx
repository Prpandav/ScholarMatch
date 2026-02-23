/**
 * components/ResultsView.jsx
 * ---------------------------
 * Displays the grid of ScholarshipCards returned by the AI service.
 *
 * Props:
 *   studentName   — string (shown in the heading)
 *   scholarships  — array of scholarship objects (max 3)
 *   onReset       — callback to return to the form (State 1)
 */

import ScholarshipCard from "./ScholarshipCard";

export default function ResultsView({ studentName, scholarships, onReset }) {
  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-slide-up">
      {/* Section heading */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-4">
          ✨ Analysis Complete
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">
          Your Top Scholarship Matches
        </h2>
        <p className="text-slate-500 text-base">
          Personalized results for{" "}
          <span className="font-semibold text-indigo-600">{studentName}</span> —
          ranked by AI compatibility score
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {scholarships.map((scholarship, index) => (
          <ScholarshipCard
            key={scholarship.id}
            scholarship={scholarship}
            index={index}
          />
        ))}
      </div>

      {/* Summary bar */}
      <div className="glass-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="text-sm text-slate-600 text-center sm:text-left">
          <span className="font-semibold text-slate-800">
            {scholarships.length} scholarships
          </span>{" "}
          matched from our database.{" "}
          <span className="text-indigo-500">Apply early for best results.</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
          Powered by ScholarMatch AI
        </div>
      </div>

      {/* Search again */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-indigo-200
                     text-indigo-600 font-semibold text-sm hover:bg-indigo-50 hover:border-indigo-400
                     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          ← Search Again
        </button>
      </div>
    </div>
  );
}
