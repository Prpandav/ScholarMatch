/**
 * routes/chat.js
 * ──────────────────────────────────────────────────────
 * POST /api/chat
 * Proxies the student message (+ optional profile) to
 * the FastAPI /chat endpoint and streams the response back.
 */
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
  const { message, studentProfile } = req.body;

  if (!message || !message.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Message is required" });
  }

  try {
    const mlRes = await axios.post(
      `${process.env.ML_SERVICE_URL}/chat`,
      {
        message,
        student_profile: studentProfile || null,
      },
      { timeout: 30_000 }, // Gemini can take up to ~10s on first call
    );

    return res.json({ success: true, ...mlRes.data });
  } catch (err) {
    const detail = err.response?.data?.detail || err.message;
    console.error("💬 Chat proxy error:", detail);
    return res.status(502).json({
      success: false,
      message: "Chat service unavailable. Please try again.",
      error: detail,
    });
  }
});

module.exports = router;
