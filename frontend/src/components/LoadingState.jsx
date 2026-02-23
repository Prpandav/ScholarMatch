/**
 * components/LoadingState.jsx
 * ---------------------------
 * Animated loading panel shown while the AI inference is running.
 * Displayed between form submission and receiving the results.
 */

export default function LoadingState() {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-20 animate-fade-slide-up">
      {/* Spinner ring */}
      <div className="relative w-24 h-24 mb-8">
        {/* Outer glow pulse */}
        <div className="absolute inset-0 rounded-full bg-indigo-200 animate-ping opacity-30" />
        {/* Main spinner */}
        <svg
          className="absolute inset-0 w-24 h-24 animate-spin"
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="48" cy="48" r="40" stroke="#e0e7ff" strokeWidth="8" />
          <path
            d="M48 8 a40 40 0 0 1 40 40"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        {/* Central icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">🤖</span>
        </div>
      </div>

      {/* Text */}
      <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">
        AI is analyzing your profile
        <span className="inline-flex ml-1">
          <Dots />
        </span>
      </h3>
      <p className="text-slate-500 text-sm text-center max-w-xs">
        Scanning 500+ scholarships and ranking the best matches using machine
        learning.
      </p>

      {/* Progress steps */}
      <div className="mt-8 space-y-2.5 w-full max-w-xs">
        {[
          { label: "Reading your profile", delay: "0ms", done: true },
          { label: "Running eligibility model", delay: "600ms", done: true },
          {
            label: "Ranking by cosine similarity",
            delay: "1200ms",
            done: false,
          },
        ].map((step) => (
          <div
            key={step.label}
            className="flex items-center gap-3 text-sm text-slate-600"
            style={{
              animation: `fadeSlideUp 0.4s ${step.delay} ease-out both`,
            }}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0
              ${
                step.done
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-slate-100 text-slate-400 animate-pulse"
              }`}
            >
              {step.done ? "✓" : "···"}
            </span>
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Animated ellipsis dots */
function Dots() {
  return (
    <>
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="animate-pulse text-indigo-600 font-extrabold"
          style={{ animationDelay: `${delay}ms` }}
        >
          .
        </span>
      ))}
    </>
  );
}
