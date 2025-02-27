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
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Please provide a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide a phone number"],
      unique: true,
      trim: true,
      match: [
        /^[0-9]{10}$/,
        "Phone number must be exactly 10 digits",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
