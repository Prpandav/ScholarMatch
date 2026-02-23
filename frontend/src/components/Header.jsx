/**
 * components/Header.jsx — ScholarMatch v2
 * Language switcher + Dark mode toggle + status badge
 */
import { useTranslation } from "react-i18next";
import { useDarkMode } from "../context/DarkModeContext";
import i18n from "../i18n";

const LANGS = [
  { code: "en", label: "EN", name: "English" },
  { code: "hi", label: "HI", name: "हिन्दी" },
  { code: "gu", label: "GU", name: "ગુજ" },
];

export default function Header() {
  const { t } = useTranslation();
  const { dark, toggle } = useDarkMode();

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("sm_lang", code);
  };

  return (
    <header
      className="w-full flex items-center justify-between px-6 py-4 mb-8
                       glass-card rounded-2xl border border-white/60 dark:border-white/10"
    >
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600
                        flex items-center justify-center text-white text-lg shadow-lg"
        >
          🎓
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            ScholarMatch
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-tight">
            AI-Powered Scholarship Engine
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Fairness badge */}
        <span
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full
                         bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200
                         dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-semibold"
        >
          ⚖️ {t("fairness_badge")}
        </span>

        {/* AI status */}
        <span
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                         bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200
                         dark:border-indigo-700 text-indigo-600 dark:text-indigo-300 text-xs font-semibold"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          AI Online
        </span>

        {/* Language switcher */}
        <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => changeLang(l.code)}
              title={l.name}
              className={`px-2.5 py-1.5 text-xs font-semibold transition-colors
                ${
                  i18n.language === l.code
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Dark mode toggle — pill style */}
        <button
          onClick={toggle}
          title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`relative flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold
                      border-2 transition-all duration-200 select-none
                      ${
                        dark
                          ? "bg-slate-700 border-slate-500 text-yellow-300 hover:bg-slate-600"
                          : "bg-indigo-50 border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                      }`}
        >
          <span className="text-sm">{dark ? "☀️" : "🌙"}</span>
          <span>{dark ? "Light" : "Dark"}</span>
        </button>
      </div>
    </header>
  );
}
