const mongoose = require("mongoose");

const artToySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ชื่อของ model User
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // prompt: {
    //   type: String,
    //   required: true,
    // },

    size: {
      type: String,
      required: true,
    },

    material: {
      type: String,
      required: true,
    },

    painting: {
      type: String,
      required: true,
    },

    assembly: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // เพิ่ม createdAt และ updatedAt อัตโนมัติ
  }
);

const Arttoy = mongoose.model("Arttoy", artToySchema);

module.exports = Arttoy;
