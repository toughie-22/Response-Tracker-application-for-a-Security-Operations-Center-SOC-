const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add an incident title"],
      trim: true,
      maxlength: [100, "Title can not be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description of the incident"],
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "investigating", "mitigated", "closed"],
      default: "open",
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Incident", incidentSchema);
