const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const User = require("../models/User");

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
    status: "Pending"
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

module.exports = {
    createOrder,
    getOrderByUserId
};
