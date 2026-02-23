/**
 * services/api.js — ScholarMatch v2
 */
import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export async function getRecommendations(profile) {
  const res = await api.post("/recommendations", profile);
  return res.data;
}

export async function getStats() {
  const res = await api.get("/stats");
  return res.data;
}

export async function getHistory() {
  const res = await api.get("/history");
  return res.data;
}

export async function verifyDocument(file) {
  const form = new FormData();
  form.append("document", file);
  const res = await api.post("/documents/verify", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
