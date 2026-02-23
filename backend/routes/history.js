/**
 * routes/history.js
 * -----------------
 * GET /api/history  — returns last 10 student profile searches from MongoDB
 */
const express = require("express");
const router = express.Router();
const StudentProfile = require("../models/StudentProfile");

router.get("/", async (req, res) => {
  try {
    const history = await StudentProfile.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name gpa income gender region caste createdAt");

    res.json({ success: true, count: history.length, history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
