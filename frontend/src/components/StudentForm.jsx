/**
 * components/StudentForm.jsx — v2
 * BUG FIX: Field component moved OUTSIDE StudentForm so React never
 * treats it as a new component type on re-render (which caused focus loss).
 */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const INITIAL = {
  name: "",
  gpa: "",
  income: "",
  gender: "",
  region: "",
  caste: "",
};

// ── Profile Strength indicator (defined outside to avoid remount) ──────────────
function ProfileStrength({ profile }) {
  const fields = ["name", "gpa", "income", "gender", "region", "caste"];
  const filled = fields.filter((f) => {
    const v = profile[f];
    return v !== "" && v !== undefined && v !== null;
  }).length;
  const pct = Math.round((filled / fields.length) * 100);
  const color =
    pct < 40
      ? "from-red-400 to-orange-400"
      : pct < 70
        ? "from-yellow-400 to-amber-400"
        : "from-emerald-400 to-teal-500";
  const label =
    pct < 40
      ? "Weak"
      : pct < 70
        ? "Moderate"
        : pct < 100
          ? "Strong"
          : "Complete";
  return (
    <div className="mb-5 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Profile Strength
        </span>
        <span className="text-xs font-bold text-slate-800 dark:text-white">
          {pct}% — {label}
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-white dark:bg-slate-700 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Text / number input field (defined outside to avoid remount on re-render) ──
function TextField({ id, label, type, placeholder, value, onChange, error }) {
  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        type={type || "text"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`form-field ${error ? "border-red-300 focus:ring-red-300" : ""}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ── Select field (defined outside to avoid remount on re-render) ───────────────
function SelectField({ id, label, value, onChange, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`form-field ${error ? "border-red-300" : ""}`}
      >
        {children}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ── Main form component ────────────────────────────────────────────────────────
export default function StudentForm({ onSubmit, loading, initialValues }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      // input[type=number] values must be strings in React controlled components
      setForm({
        ...initialValues,
        gpa: String(initialValues.gpa ?? ""),
        income: String(initialValues.income ?? ""),
      });
    }
  }, [initialValues]);

  // Single change handler — returns a stable function per field key
  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    const g = parseFloat(form.gpa);
    if (isNaN(g) || g < 0 || g > 10) e.gpa = "GPA must be 0 – 10";
    const inc = parseInt(form.income);
    if (isNaN(inc) || inc < 0) e.income = "Enter a valid income";
    if (!form.gender) e.gender = "Select gender";
    if (!form.region) e.region = "Select region";
    if (!form.caste) e.caste = "Select category";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit({
      ...form,
      gpa: parseFloat(form.gpa),
      income: parseInt(form.income),
    });
  };

  return (
    <div className="glass-card p-8 w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">
          {t("form_title")}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t("form_subtitle")}
        </p>
      </div>

      <ProfileStrength profile={form} />

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Full Name */}
        <TextField
          id="name"
          label={t("name")}
          placeholder="e.g. Riya Sharma"
          value={form.name}
          onChange={handleChange("name")}
          error={errors.name}
        />

        {/* GPA + Income */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            id="gpa"
            label={`${t("gpa")} (0–10)`}
            type="number"
            placeholder="e.g. 8.5"
            value={form.gpa}
            onChange={handleChange("gpa")}
            error={errors.gpa}
          />
          <TextField
            id="income"
            label={t("income")}
            type="number"
            placeholder="e.g. 250000"
            value={form.income}
            onChange={handleChange("income")}
            error={errors.income}
          />
        </div>

        {/* Gender + Region + Caste */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SelectField
            id="gender"
            label={t("gender")}
            value={form.gender}
            onChange={handleChange("gender")}
            error={errors.gender}
          >
            <option value="">{t("select")}</option>
            <option value="Male">{t("male")}</option>
            <option value="Female">{t("female")}</option>
            <option value="Other">{t("other")}</option>
          </SelectField>

          <SelectField
            id="region"
            label={t("region")}
            value={form.region}
            onChange={handleChange("region")}
            error={errors.region}
          >
            <option value="">{t("select")}</option>
            <option value="Urban">{t("urban")}</option>
            <option value="Rural">{t("rural")}</option>
            <option value="Semi-Urban">{t("semi_urban")}</option>
          </SelectField>

          <SelectField
            id="caste"
            label={t("caste")}
            value={form.caste}
            onChange={handleChange("caste")}
            error={errors.caste}
          >
            <option value="">{t("select")}</option>
            <option value="General">{t("general")}</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </SelectField>
        </div>

        <button
          id="submit-btn"
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              {t("analyzing")}
            </>
          ) : (
            t("submit")
          )}
        </button>
      </form>
    </div>
  );
}
