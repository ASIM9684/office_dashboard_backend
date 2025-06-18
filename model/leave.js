const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  reason: {
    type: String, 
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Accepted", "Rejected", "Pending"],
    default: "Pending",
  },
  leaveDate: {
    type: Date,
    default: Date.now,
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

leaveSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const leave = mongoose.model("leave", leaveSchema);
module.exports = leave;
