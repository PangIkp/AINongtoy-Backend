const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true,
      maxlength: [40, "Username cannot be more than 40 characters"],
      lowercase: true, // ทำให้เป็นตัวพิมพ์เล็กทั้งหมด
    },
    firstName: {
      type: String,
      required: [true, "Please provide your first name"],
      trim: true,
      maxlength: [40, "First Name cannot be more than 40 characters"],
      validate: {
        validator: function (v) {
          return /^[A-Za-z]+$/.test(v);
        },
        message: "First Name should contain only alphabets",
      },
    },
    lastName: {
      type: String,
      required: [true, "Please provide your last name"],
      trim: true,
      maxlength: [40, "Last Name cannot be more than 40 characters"],
      validate: {
        validator: function (v) {
          return /^[A-Za-z]+$/.test(v);
        },
        message: "Last Name should contain only alphabets",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
