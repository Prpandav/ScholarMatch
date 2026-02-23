/**
 * context/ToastContext.jsx
 * Provides a global toast notification system.
 * Usage: const { showToast } = useToast();
 *        showToast("Message", "success" | "error" | "info")
 */
import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000,
    );
  }, []);

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const icons = { success: "✅", error: "❌", info: "ℹ️" };
  const colors = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-indigo-50 border-indigo-200 text-indigo-800",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg
                        animate-fade-slide-up ${colors[t.type]} transition-all`}
          >
            <span>{icons[t.type]}</span>
            <span className="flex-1 text-sm font-medium">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="text-gray-400 hover:text-gray-600 font-bold text-lg leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
