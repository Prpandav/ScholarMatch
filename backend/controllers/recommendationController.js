/**
 * controllers/recommendationController.js
 * ----------------------------------------
 * Business logic for the POST /api/recommendations endpoint.
 *
 * Flow:
 *   1. Validate & save the student profile to MongoDB
 *   2. Forward the profile to the Python FastAPI ML service
 *   3. Return the scholarship matches to the client
 */

const axios = require("axios");
const StudentProfile = require("../models/StudentProfile");

/**
 * @desc    Save student profile + fetch AI scholarship recommendations
 * @route   POST /api/recommendations
 * @access  Public (auth will be added in a later task)
 */
const getRecommendations = async (req, res) => {
  const { name, gpa, income, gender, region, caste } = req.body;

  // ── Step 1: Basic presence check before hitting DB ──────────────────────
  if (!name || gpa == null || income == null || !gender || !region || !caste) {
    return res.status(400).json({
      success: false,
      message:
        "All fields are required: name, gpa, income, gender, region, caste",
    });
  }

  // ── Step 2: Save profile to MongoDB ─────────────────────────────────────
  let savedProfile;
  try {
    savedProfile = await StudentProfile.create({
      name,
      gpa,
      income,
      gender,
      region,
      caste,
    });
    console.log(`💾 Profile saved: ${savedProfile._id} — ${name}`);
  } catch (dbError) {
    // Catches Mongoose validation errors (enum checks, min/max, etc.)
    return res.status(500).json({
      success: false,
      message: "Failed to save student profile to database",
      error: dbError.message,
    });
  }

  // ── Step 3: Call the Python FastAPI ML microservice ──────────────────────
  let mlResponse;
  try {
    mlResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/predict`,
      { name, gpa, income, gender, region, caste },
      {
        headers: { "Content-Type": "application/json" },
        // Fail fast if the ML service is down — don't block the user
        timeout: 10000,
      },
    );
    console.log(
      `🤖 ML service responded for: ${name} — ${mlResponse.data.total_matches} matches`,
    );
  } catch (mlError) {
    // ML service is down or timed out — surface a clean 503
    return res.status(503).json({
      success: false,
      message:
        "ML recommendation service is currently unavailable. Your profile was saved.",
      profileId: savedProfile._id,
      error: mlError.message,
    });
  }

  // ── Step 4: Return combined response to client ───────────────────────────
  return res.status(200).json({
    success: true,
    profileId: savedProfile._id,
    student_name: mlResponse.data.student_name,
    total_matches: mlResponse.data.total_matches,
    fairness_note: mlResponse.data.fairness_note,
    scholarships: mlResponse.data.scholarships,
  });
};

module.exports = { getRecommendations };
