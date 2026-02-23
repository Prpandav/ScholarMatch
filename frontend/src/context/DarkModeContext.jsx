/**
 * context/DarkModeContext.jsx
 * Provides dark mode state and toggle, persisted in localStorage.
 * Applies 'dark' class to <html> element via Tailwind's class strategy.
 */
import { createContext, useContext, useEffect, useState } from "react";

const DarkModeContext = createContext(null);

export function DarkModeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("sm_dark");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("sm_dark", dark);
  }, [dark]);

  return (
    <DarkModeContext.Provider
      value={{ dark, toggle: () => setDark((d) => !d) }}
    >
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => useContext(DarkModeContext);
