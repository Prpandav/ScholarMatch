/**
 * components/StudentForm.jsx
 * --------------------------
 * Controlled form that collects the six StudentProfile fields.
 * All state is managed internally; the final profile object is
 * lifted to App.jsx via the onSubmit prop.
 *
 * Props:
 *   onSubmit(profileData) — called on valid form submission
 *   isLoading             — disables the submit button while fetching
 */

import { useState } from "react";

const INITIAL_STATE = {
  name: "",
  gpa: "",
  income: "",
  gender: "",
  region: "",
  caste: "",
};

export default function StudentForm({ onSubmit, isLoading }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the field error as soon as the user starts typing
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.gpa) newErrors.gpa = "GPA is required.";
    else if (form.gpa < 0 || form.gpa > 10)
      newErrors.gpa = "GPA must be between 0 and 10.";
    if (!form.income) newErrors.income = "Annual income is required.";
    if (!form.gender) newErrors.gender = "Please select a gender.";
    if (!form.region) newErrors.region = "Please select a region.";
    if (!form.caste) newErrors.caste = "Please select a category.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({
      name: form.name.trim(),
      gpa: parseFloat(form.gpa),
      income: parseInt(form.income, 10),
      gender: form.gender,
      region: form.region,
      caste: form.caste,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-slide-up">
      {/* Hero text */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">
          Find Your Perfect Scholarship
        </h2>
        <p className="text-slate-500 text-base font-normal">
          Fill in your profile below — our AI will match you with the best
          opportunities in seconds.
        </p>
      </div>

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="glass-card p-8 space-y-5"
      >
        {/* Full Name */}
        <div>
          <label className="form-label" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Riya Sharma"
            value={form.name}
            onChange={handleChange}
            className={`form-field ${errors.name ? "border-red-400 focus:ring-red-300" : ""}`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        {/* GPA + Income — side by side on md+ screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label" htmlFor="gpa">
              GPA{" "}
              <span className="text-slate-400 font-normal">(0 – 10 scale)</span>
            </label>
            <input
              id="gpa"
              name="gpa"
              type="number"
              min="0"
              max="10"
              step="0.1"
              placeholder="e.g. 8.5"
              value={form.gpa}
              onChange={handleChange}
              className={`form-field ${errors.gpa ? "border-red-400 focus:ring-red-300" : ""}`}
            />
            {errors.gpa && (
              <p className="mt-1 text-xs text-red-500">{errors.gpa}</p>
            )}
          </div>

          <div>
            <label className="form-label" htmlFor="income">
              Annual Family Income{" "}
              <span className="text-slate-400 font-normal">(₹)</span>
            </label>
            <input
              id="income"
              name="income"
              type="number"
              min="0"
              step="1000"
              placeholder="e.g. 250000"
              value={form.income}
              onChange={handleChange}
              className={`form-field ${errors.income ? "border-red-400 focus:ring-red-300" : ""}`}
            />
            {errors.income && (
              <p className="mt-1 text-xs text-red-500">{errors.income}</p>
            )}
          </div>
        </div>

        {/* Gender + Region + Caste — three selects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="form-label" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={`form-field ${errors.gender ? "border-red-400 focus:ring-red-300" : ""}`}
            >
              <option value="">Select…</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-xs text-red-500">{errors.gender}</p>
            )}
          </div>

          <div>
            <label className="form-label" htmlFor="region">
              Region
            </label>
            <select
              id="region"
              name="region"
              value={form.region}
              onChange={handleChange}
              className={`form-field ${errors.region ? "border-red-400 focus:ring-red-300" : ""}`}
            >
              <option value="">Select…</option>
              <option>Urban</option>
              <option>Rural</option>
              <option>Semi-Urban</option>
            </select>
            {errors.region && (
              <p className="mt-1 text-xs text-red-500">{errors.region}</p>
            )}
          </div>

          <div>
            <label className="form-label" htmlFor="caste">
              Caste Category
            </label>
            <select
              id="caste"
              name="caste"
              value={form.caste}
              onChange={handleChange}
              className={`form-field ${errors.caste ? "border-red-400 focus:ring-red-300" : ""}`}
            >
              <option value="">Select…</option>
              <option>General</option>
              <option>OBC</option>
              <option>SC</option>
              <option>ST</option>
            </select>
            {errors.caste && (
              <p className="mt-1 text-xs text-red-500">{errors.caste}</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Analyzing…
              </span>
            ) : (
              "✨ Find My Scholarships"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
