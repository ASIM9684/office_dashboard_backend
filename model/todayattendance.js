const mongoose = require("mongoose");

const todayattendanceSchema = new mongoose.Schema({
  startTime: {
    type: String, 
    required: true,
    trim: true,
  },
  endTime: {
    type: String, 
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

todayattendanceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const todayattendance = mongoose.model("todayattendance", todayattendanceSchema);
module.exports = todayattendance;
