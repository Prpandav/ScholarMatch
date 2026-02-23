/**
 * components/ResultsView.jsx — v2
 * Includes: fairness note, comparison chart, What-If simulator,
 *           document upload, history panel, PDF export.
 */
import { useTranslation } from "react-i18next";
import { useToast } from "../context/ToastContext";
import ScholarshipCard from "./ScholarshipCard";
import WhatIfSimulator from "./WhatIfSimulator";
import MatchChart from "./MatchChart";
import DocumentUpload from "./DocumentUpload";
import HistoryPanel from "./HistoryPanel";

export default function ResultsView({
  scholarships,
  profile,
  fairness_note,
  onReset,
  onSimulate,
  onRerun,
}) {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const studentName = profile?.name || "Student";

  // ── PDF export ──────────────────────────────────────────────────────────
  const exportPDF = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.setTextColor(79, 70, 229);
      doc.text("ScholarMatch — AI Scholarship Report", 20, 20);

      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text(`Student: ${studentName}`, 20, 32);
      doc.text(
        `GPA: ${profile?.gpa}  |  Income: ₹${profile?.income?.toLocaleString("en-IN")}`,
        20,
        40,
      );
      doc.text(
        `Category: ${profile?.caste}  |  Region: ${profile?.region}  |  Gender: ${profile?.gender}`,
        20,
        48,
      );
      doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 20, 56);

      doc.setDrawColor(200, 200, 200);
      doc.line(20, 62, 190, 62);

      scholarships.forEach((s, i) => {
        const y = 72 + i * 58;
        doc.setFontSize(12);
        doc.setTextColor(79, 70, 229);
        doc.text(`#${i + 1} — ${s.name}`, 20, y);

        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        doc.text(`Provider: ${s.provider}`, 20, y + 7);
        doc.text(
          `Amount: ₹${s.amount.toLocaleString("en-IN")}/year  |  Match: ${Math.round(s.match_score * 100)}%  |  Deadline: ${s.deadline}`,
          20,
          y + 14,
        );
        doc.text(`Category: ${s.category}`, 20, y + 21);
        doc.setTextColor(71, 85, 105);
        doc.text(`Explanation: ${s.explanation?.[0] || "—"}`, 20, y + 28, {
          maxWidth: 170,
        });
      });

      doc.save(`ScholarMatch_${studentName.replace(/\s+/, "_")}_Report.pdf`);
      showToast("PDF report downloaded!", "success");
    } catch (e) {
      showToast("PDF export failed: " + e.message, "error");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-slide-up">
      {/* Section heading */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                        bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100
                        dark:border-indigo-800 text-indigo-600 dark:text-indigo-300
                        text-xs font-semibold mb-4"
        >
          ✨ {t("analysis_complete")}
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2 tracking-tight">
          {t("results_title")}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          {t("results_subtitle")} for{" "}
          <span className="font-semibold text-indigo-600">{studentName}</span>
        </p>
      </div>

      {/* Fairness audit note */}
      {fairness_note && (
        <div
          className="flex items-start gap-3 px-5 py-3 rounded-xl
                        bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200
                        dark:border-emerald-700 text-emerald-800 dark:text-emerald-300
                        text-sm mb-6"
        >
          <span className="text-lg flex-shrink-0">⚖️</span>
          <span>{fairness_note}</span>
        </div>
      )}

      {/* Scholarship cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {scholarships.map((s, i) => (
          <ScholarshipCard key={s.id} scholarship={s} index={i} />
        ))}
      </div>

      {/* Match chart */}
      <MatchChart scholarships={scholarships} />

      {/* What-If Simulator */}
      <WhatIfSimulator baseProfile={profile} onResults={onSimulate} />

      {/* Document Upload / OCR */}
      <DocumentUpload />

      {/* Search History */}
      <HistoryPanel onRerun={onRerun} />

      {/* Action bar */}
      <div className="glass-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center sm:text-left">
          <span className="font-semibold text-slate-800 dark:text-white">
            {scholarships.length} scholarships
          </span>{" "}
          matched · powered by ScholarMatch AI 🤖
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={exportPDF}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600
                       text-white font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-md"
          >
            {t("download_pdf")}
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-indigo-200
                       dark:border-indigo-700 text-indigo-600 dark:text-indigo-300 font-semibold text-sm
                       hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-400 transition-all"
          >
            {t("search_again")}
          </button>
        </div>
      </div>
    </div>
  );
}
