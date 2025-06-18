const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  clockTime: {
    type: String, 
    required: true,
    trim: true,
  },
  breakTime: {
    type: String, 
    trim: true,
  },
  startTime: {
    type: String, 
    required: true,
    trim: true,
  },
  endTime: {
    type: String, 
    trim: true,
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

attendanceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const attendance = mongoose.model("attendance", attendanceSchema);
module.exports = attendance;
