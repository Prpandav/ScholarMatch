/**
 * components/HeroSection.jsx
 * ---------------------------
 * Animated landing hero with live stats counters and architecture diagram.
 * Shown above the form on the idle state.
 */
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) {
            setCount(target);
            clearInterval(timer);
          } else setCount(start);
        }, 25);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

const HOW_IT_WORKS = [
  {
    icon: "📝",
    key: "step1_title",
    descKey: "step1_desc",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: "🤖",
    key: "step2_title",
    descKey: "step2_desc",
    color: "from-indigo-500 to-violet-500",
  },
  {
    icon: "🎓",
    key: "step3_title",
    descKey: "step3_desc",
    color: "from-violet-500 to-purple-500",
  },
];

export default function HeroSection({ onGetStarted }) {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    total_scholarships: 25,
    total_aid_crore: 14.7,
    students_helped: 1247,
    states_covered: 28,
  });

  useEffect(() => {
    axios
      .get("/api/stats")
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, []);

  return (
    <div className="w-full">
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white px-8 py-16 mb-12 text-center shadow-2xl">
        {/* Decorative orbs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

        <div className="relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-xs font-semibold mb-4 backdrop-blur-sm border border-white/30">
            🇮🇳 For Every Indian Student
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
            {t("hero_title")} <br />
            <span className="text-yellow-300">{t("hero_subtitle")}</span>
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8 font-normal">
            {t("hero_desc")}
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-700
                       font-bold text-base hover:bg-yellow-300 hover:text-indigo-900
                       transition-all duration-200 shadow-xl hover:scale-105 active:scale-95"
          >
            ✨ {t("cta")}
          </button>
        </div>
      </div>

      {/* ── Live Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          {
            label: t("stats_scholarships"),
            value: stats.total_scholarships,
            suffix: "+",
            icon: "📚",
          },
          {
            label: t("stats_aid"),
            value: Math.round(stats.total_aid_crore),
            suffix: " Cr",
            icon: "💰",
          },
          {
            label: t("stats_students"),
            value: stats.students_helped,
            suffix: "+",
            icon: "👩‍🎓",
          },
          {
            label: t("stats_states"),
            value: stats.states_covered,
            suffix: "",
            icon: "🗺️",
          },
        ].map((s) => (
          <div key={s.label} className="glass-card p-5 text-center">
            <div className="text-3xl mb-1">{s.icon}</div>
            <div className="text-3xl font-extrabold text-indigo-600">
              <AnimatedCounter target={s.value} suffix={s.suffix} />
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── How It Works ── */}
      <div className="mb-12">
        <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white text-center mb-6">
          {t("how_it_works")}
        </h3>
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          {HOW_IT_WORKS.map((step, i) => (
            <div
              key={step.key}
              className="flex-1 glass-card p-6 text-center relative"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color}
                              flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg`}
              >
                {step.icon}
              </div>
              <div
                className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-indigo-600 text-white
                              text-xs font-bold flex items-center justify-center shadow"
              >
                {i + 1}
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white mb-1">
                {t(step.key)}
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {t(step.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
