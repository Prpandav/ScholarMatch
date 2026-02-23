/**
 * App.jsx — ScholarMatch v2 Root
 * State machine: idle → loading → results
 * Integrates: Hero, Form, Results, Toast, DarkMode, i18n
 */
import { useState, useRef } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import StudentForm from "./components/StudentForm";
import LoadingState from "./components/LoadingState";
import ResultsView from "./components/ResultsView";
import { getRecommendations } from "./services/api";
import { useToast } from "./context/ToastContext";

export default function App() {
  const { showToast } = useToast();
  const [uiState, setUiState] = useState("idle"); // idle | loading | results
  const [scholarships, setScholarships] = useState([]);
  const [profile, setProfile] = useState(null);
  const [fairnessNote, setFairnessNote] = useState("");
  const [rerunValues, setRerunValues] = useState(null); // for history re-run
  const formRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (formData) => {
    setUiState("loading");
    setProfile(formData);
    try {
      const data = await getRecommendations(formData);
      setScholarships(data.scholarships || []);
      setFairnessNote(data.fairness_note || "");
      setUiState("results");
      showToast(
        `Found ${data.scholarships?.length} scholarships for ${formData.name}!`,
        "success",
      );
    } catch (err) {
      setUiState("idle");
      showToast(
        err.message || "Something went wrong. Please try again.",
        "error",
      );
    }
  };

  // Called by WhatIfSimulator when sliders change
  const handleSimulate = (data, modifiedProfile) => {
    setScholarships(data.scholarships || []);
    setFairnessNote(data.fairness_note || "");
    setProfile(modifiedProfile);
  };

  // Called by HistoryPanel re-run
  const handleRerun = (historyItem) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setRerunValues(historyItem);
    setUiState("idle");
  };

  const handleReset = () => {
    setUiState("idle");
    setRerunValues(null);
    setScholarships([]);
    setProfile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      <Header />

      {/* ── LOADING ── */}
      {uiState === "loading" && <LoadingState />}

      {/* ── RESULTS ── */}
      {uiState === "results" && (
        <ResultsView
          scholarships={scholarships}
          profile={profile}
          fairness_note={fairnessNote}
          onReset={handleReset}
          onSimulate={handleSimulate}
          onRerun={handleRerun}
        />
      )}

      {/* ── IDLE (hero + form) ── */}
      {uiState === "idle" && (
        <>
          <HeroSection onGetStarted={scrollToForm} />
          <div ref={formRef} className="flex justify-center">
            <StudentForm
              onSubmit={handleSubmit}
              loading={false}
              initialValues={rerunValues}
            />
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-slate-400 dark:text-slate-600 pb-4">
        ScholarMatch © 2025 · AI-Powered · Built for every Indian student ·{" "}
        <span className="text-indigo-400">CU Hackathon</span>
      </footer>
    </div>
  );
}
