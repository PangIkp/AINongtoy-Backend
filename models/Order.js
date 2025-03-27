const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
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

    quantity: {
    type: Number,
    required: true,
    },

    imageUrl: {
    type: String,
    required: true,
    },

    status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered"],
    default: "Pending",
    },

    price: {
    type: Number,
    required: true,
    },

    shipping: {
    type: Number,
    required: true,
    },

    total: {
    type: Number,
    required: true,
    },

    address: {
    type: String,
    required: true,
    },

    payment: {
    type: String,
    required: true,
    },

    paymentStatus: {
    type: String,
    enum: ["Unpaid", "Paid"],
    default: "Unpaid",
    },
  },
  {
    timestamps: true, // เพิ่ม createdAt และ updatedAt อัตโนมัติ
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
