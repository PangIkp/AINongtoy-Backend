const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose"); 
const Order = require("../models/Order");
const User = require("../models/User");
const { authorize } = require("../middleware/auth"); 

const createOrder = asyncHandler(async (req, res) => {
    const { name, size, material, painting, assembly, quantity, price, shipping, total, address, payment, imageUrl } = req.body;
    const userId = req.user.id; // ใช้ user ID จาก middleware

  // ตรวจสอบว่าผู้ใช้มีอยู่จริงหรือไม่
  if (!userId) {
    return res.status(401).json({ message: "User not found" });
  }

  // สร้างคำสั่งซื้อ
  const order = await Order.create({
    user: userId,
    name,
    size,
    material,
    painting,
    assembly,
    quantity,
    price,
    shipping,
    total,
    address,
    payment,
    imageUrl,
    status: "Pending",
    paymentStatus: "Unpaid"
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});
// ✅ ดึงคำสั่งซื้อทั้งหมดของผู้ใช้ตาม userId
const getOrderByUserId = asyncHandler(async (req, res) => {
    const userId = req.user.id; // ใช้ user ID จาก middleware

    if (!userId) {
        return res.status(401).json({ message: "User not found" });
    }

    // ดึงคำสั่งซื้อของผู้ใช้
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: orders,
    });
});

const getOrderById = asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
  
      console.log("Received orderId:", id);
  
      // ตรวจสอบว่า orderId เป็น ObjectId ที่ถูกต้องหรือไม่
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Order ID" });
      }
  
      // ค้นหา Order และตรวจสอบว่าเป็นของ userId หรือไม่
      const order = await Order.findOne({ _id: id, user: userId }).populate("user", "phoneNumber");
  
      if (!order) {
        return res.status(404).json({ message: "Order not found or access denied" });
      }
  
      res.status(200).json(order);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ message: error.message });
    }
  });

  // for Admin

  const getAllOrdersForAdmin = asyncHandler(async (req, res) => {
    // ตรวจสอบว่า user เป็น admin หรือไม่
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "User does not have admin privileges",
      });
    }
  
    // ดึงคำสั่งซื้อทั้งหมดจากฐานข้อมูล
    const orders = await Order.find().sort({ createdAt: -1 });
  
    res.status(200).json({
      success: true,
      data: orders,
    });
  });

module.exports = {
    createOrder,
    getOrderByUserId,
    getOrderById,
    getAllOrdersForAdmin,
};
