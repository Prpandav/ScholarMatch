/**
 * src/i18n.js
 * ------------
 * i18next configuration for EN / HI / GU.
 * Imported once in main.jsx before the React tree mounts.
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import gu from "./locales/gu.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    gu: { translation: gu },
  },
  lng: localStorage.getItem("sm_lang") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
