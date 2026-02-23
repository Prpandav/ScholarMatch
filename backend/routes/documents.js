/**
 * routes/documents.js
 * --------------------
 * POST /api/documents/verify
 * Accepts a file upload, forwards to FastAPI OCR endpoint, returns result.
 */
const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

// Store file in memory — no disk writes needed for demo
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, and PDF files are allowed"));
  },
});

router.post("/verify", upload.single("document"), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  try {
    // Forward the file buffer to the FastAPI /verify-document endpoint
    const form = new FormData();
    form.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const mlRes = await axios.post(
      `${process.env.ML_SERVICE_URL}/verify-document`,
      form,
      { headers: form.getHeaders(), timeout: 15000 },
    );

    res.json({ success: true, ...mlRes.data });
  } catch (err) {
    const msg =
      err.response?.data?.detail || err.message || "OCR verification failed";
    res.status(500).json({ success: false, message: msg });
  }
});

module.exports = router;
