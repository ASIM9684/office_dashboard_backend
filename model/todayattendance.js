const mongoose = require("mongoose");

const todayattendanceSchema = new mongoose.Schema(
  {
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    endTime: {
      type: String,
      trim: true,
    },
    breakTime: {
      type: String,
      default: "00:00:00",
      trim: true,
    },
    status: {
      type: String,
    },
    deviceType: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const todayattendance = mongoose.model("todayattendance", todayattendanceSchema);
module.exports = todayattendance;
