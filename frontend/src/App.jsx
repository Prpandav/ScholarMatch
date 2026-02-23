/**
 * App.jsx
 * -------
 * Root component — owns all application state and orchestrates
 * which view is rendered based on the current status.
 *
 * Status machine:
 *   "idle"    → StudentForm (waiting for user input)
 *   "loading" → LoadingState (API call in-flight)
 *   "results" → ResultsView (scholarships received)
 */

import { useState } from "react";
import Header from "./components/Header";
import StudentForm from "./components/StudentForm";
import LoadingState from "./components/LoadingState";
import ResultsView from "./components/ResultsView";
import { fetchRecommendations } from "./services/api";

export default function App() {
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "results"
  const [scholarships, setScholarships] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState(""); // error toast message

  /** Called by StudentForm on valid submission */
  const handleFormSubmit = async (profileData) => {
    setError("");
    setStatus("loading");

    try {
      const data = await fetchRecommendations(profileData);
      setScholarships(data.scholarships);
      setStudentName(data.student_name);
      setStatus("results");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  /** Reset to the initial form view */
  const handleReset = () => {
    setStatus("idle");
    setScholarships([]);
    setStudentName("");
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Always-visible header */}
      <Header />

      {/* Error toast — shown only when status is "idle" and there is an error */}
      {error && status === "idle" && (
        <div className="max-w-2xl mx-auto w-full px-6 mt-6 animate-fade-slide-up">
          <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-600 font-semibold text-lg leading-none flex-shrink-0"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main content area */}
      <main className="flex-1 px-6 py-12">
        {status === "idle" && (
          <StudentForm onSubmit={handleFormSubmit} isLoading={false} />
        )}

        {status === "loading" && <LoadingState />}

        {status === "results" && (
          <ResultsView
            studentName={studentName}
            scholarships={scholarships}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-400 text-xs border-t border-slate-100">
        © {new Date().getFullYear()} ScholarMatch · AI-Powered · Built for
        Change
      </footer>
    </div>
  );
}
