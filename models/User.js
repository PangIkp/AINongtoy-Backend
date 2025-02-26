// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true,
      maxlength: [40, "Username cannot be more than 40 characters"],
    },
    firstName: {
      type: String,
      required: [true, "Please provide your first name"],
      trim: true,
      maxlength: [40, "First Name cannot be more than 40 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide your last name"],
      trim: true,
      maxlength: [40, "Last Name cannot be more than 40 characters"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
