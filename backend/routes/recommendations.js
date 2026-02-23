/**
 * routes/recommendations.js
 * --------------------------
 * Express Router for scholarship recommendation routes.
 *
 * Mounted at /api/recommendations in server.js, so:
 *   POST /  →  POST /api/recommendations
 */

const express = require("express");
const router = express.Router();
const {
  getRecommendations,
} = require("../controllers/recommendationController");

// POST /api/recommendations
router.post("/", getRecommendations);

module.exports = router;
