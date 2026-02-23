/**
 * services/api.js
 * ---------------
 * Centralised HTTP layer for the ScholarMatch frontend.
 * All backend communication lives here — if the contract or URL changes,
 * this is the only file that needs updating.
 *
 * The Vite proxy (vite.config.js) forwards /api/* → http://localhost:5000
 * so we never need to hardcode the backend origin here.
 */

import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000, // 15 s — generous timeout for ML inference
});

/**
 * fetchRecommendations
 * --------------------
 * Sends a student profile to the backend and retrieves AI-ranked scholarships.
 *
 * @param {Object} profileData  - { name, gpa, income, gender, region, caste }
 * @returns {Object}            - { student_name, total_matches, scholarships[] }
 * @throws {Error}              - With a human-readable message on failure
 */
export const fetchRecommendations = async (profileData) => {
  try {
    const response = await API.post("/recommendations", profileData);
    return response.data;
  } catch (error) {
    // Extract the most useful error message available
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred. Please try again.";
    throw new Error(message);
  }
};
