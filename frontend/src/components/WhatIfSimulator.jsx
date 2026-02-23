/**
 * components/WhatIfSimulator.jsx
 * --------------------------------
 * Lets the user tweak GPA / Income to see how rankings change in real time.
 * Re-fires /api/recommendations with the modified profile.
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getRecommendations } from "../services/api";
import { useToast } from "../context/ToastContext";

export default function WhatIfSimulator({ baseProfile, onResults }) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [gpa, setGpa] = useState(baseProfile?.gpa ?? 7.0);
  const [income, setIncome] = useState(baseProfile?.income ?? 250000);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const modified = { ...baseProfile, gpa, income };
      const data = await getRecommendations(modified);
      onResults(data, modified);
      showToast("Simulation complete — rankings updated!", "success");
    } catch (e) {
      showToast(e.message || "Simulation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 mb-6">
      <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
        🎛️ {t("simulator_title")}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
        {t("simulator_desc")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
        {/* GPA Slider */}
        <div>
          <label className="form-label flex justify-between">
            <span>GPA</span>
            <span className="text-indigo-600 font-bold">
              {gpa.toFixed(1)}/10
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={gpa}
            onChange={(e) => setGpa(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-2 rounded-lg"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>0.0</span>
            <span>10.0</span>
          </div>
        </div>

        {/* Income Slider */}
        <div>
          <label className="form-label flex justify-between">
            <span>Annual Income</span>
            <span className="text-indigo-600 font-bold">
              ₹{income.toLocaleString("en-IN")}
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="1500000"
            step="10000"
            value={income}
            onChange={(e) => setIncome(parseInt(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-2 rounded-lg"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>₹0</span>
            <span>₹15L</span>
          </div>
        </div>
      </div>

      <button
        onClick={run}
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />{" "}
            Simulating…
          </>
        ) : (
          "▶ Run Simulation"
        )}
      </button>
    </div>
  );
}
