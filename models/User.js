const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    // id: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
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
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide a phone number"],
      unique: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },

    address: {
        type: [
          {
            detail: { type: String, default: null, trim: true }, // รายละเอียด เช่น บ้านเลขที่, ถนน
            province: { type: String, required: true, trim: true },
            district: { type: String, required: true, trim: true },
            subdistrict: { type: String, required: true, trim: true },
            postalCode: { type: String, required: true, trim: true },
          },
        ],
        validate: {
          validator: function (arr) {
            return arr.length <= 3; // จำกัดให้เก็บได้สูงสุด 3 รายการ
          },
          message: "You can only store up to 3 addresses.",
        },
    },
    
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

//Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
