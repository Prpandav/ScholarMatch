import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { DarkModeProvider } from "./context/DarkModeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DarkModeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </DarkModeProvider>
  </StrictMode>,
);
