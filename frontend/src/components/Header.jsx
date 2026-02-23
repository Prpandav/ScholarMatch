/**
 * components/Header.jsx
 * ---------------------
 * Top navigation bar — always visible regardless of app state.
 */

export default function Header() {
  return (
    <header className="w-full bg-white/70 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
        {/* Logo mark */}
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md shadow-indigo-200">
          <span className="text-white text-xl">🎓</span>
        </div>

        {/* Brand text */}
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-tight tracking-tight">
            Scholar<span className="text-indigo-600">Match</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal leading-none">
            AI-Powered Scholarship Discovery
          </p>
        </div>

        {/* Spacer + badge */}
        <div className="ml-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            AI Online
          </span>
        </div>
      </div>
    </header>
  );
}
