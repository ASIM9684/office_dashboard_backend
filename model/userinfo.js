const mongoose = require("mongoose");

const userinfoSchema = new mongoose.Schema({
  profilePicture: {
    type: String,
  },
  phone: {
    type: String,
  },
  state: {
    type: String,
  },
  address: {
    type: String,
  },
  homephone: {
    type: String,
  },
  zip: {
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

userinfoSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const userinfo = mongoose.model("userinfo", userinfoSchema);
module.exports = userinfo;
