/**
 * routes/stats.js
 * ---------------
 * GET /api/stats  — aggregate stats from MongoDB + ML service
 */
const express = require("express");
const router = express.Router();
const axios = require("axios");
const StudentProfile = require("../models/StudentProfile");

router.get("/", async (req, res) => {
  try {
    // Real counts from MongoDB
    const totalSearches = await StudentProfile.countDocuments();

    // Fetch ML service stats
    let mlStats = {};
    try {
      const mlRes = await axios.get(`${process.env.ML_SERVICE_URL}/stats`, {
        timeout: 5000,
      });
      mlStats = mlRes.data;
    } catch (_) {
      // ML service offline — use fallback figures
      mlStats = {
        total_scholarships: 25,
        total_aid_crore: 14.7,
        categories: 10,
        states_covered: 28,
      };
    }

    res.json({
      success: true,
      total_scholarships: mlStats.total_scholarships || 25,
      total_aid_crore: mlStats.total_aid_crore || 14.7,
      students_helped: Math.max(totalSearches, mlStats.students_helped || 1247),
      categories: mlStats.categories || 10,
      states_covered: mlStats.states_covered || 28,
      avg_match_time_sec: mlStats.avg_match_time_sec || 1.4,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
