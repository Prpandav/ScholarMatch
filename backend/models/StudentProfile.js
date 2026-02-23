/**
 * models/StudentProfile.js
 * ------------------------
 * Mongoose schema for a student profile document.
 *
 * Fields mirror exactly the FastAPI StudentProfile Pydantic model
 * so data flows seamlessly from frontend → backend → ML service
 * without any field name mismatches.
 */

const mongoose = require("mongoose");

const StudentProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },

    gpa: {
      type: Number,
      required: [true, "GPA is required"],
      min: [0, "GPA cannot be below 0"],
      max: [10, "GPA cannot exceed 10"],
    },

    income: {
      type: Number,
      required: [true, "Annual family income is required"],
      min: [0, "Income cannot be negative"],
    },

    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Gender must be Male, Female, or Other",
      },
    },

    region: {
      type: String,
      required: [true, "Region is required"],
      enum: {
        values: ["Urban", "Rural", "Semi-Urban"],
        message: "Region must be Urban, Rural, or Semi-Urban",
      },
    },

    caste: {
      type: String,
      required: [true, "Caste category is required"],
      enum: {
        values: ["General", "OBC", "SC", "ST"],
        message: "Caste must be General, OBC, SC, or ST",
      },
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
    // Clean up the JSON output (__v is Mongoose's internal version key)
    versionKey: false,
  },
);

module.exports = mongoose.model("StudentProfile", StudentProfileSchema);
