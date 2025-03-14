const asyncHandler = require("express-async-handler");
const Favorite = require("../models/Favorite");
const mongoose = require("mongoose");

// เพิ่ม Favorite
const createFavorite = asyncHandler(async (req, res) => {
  const { imageUrl } = req.body;
  const userId = req.user.id; // ใช้ user ID จาก middleware

  // ตรวจสอบว่ารายการนี้ถูกเพิ่มไปแล้วหรือยัง
  const existingFavorite = await Favorite.findOne({ user: userId, imageUrl });
  if (existingFavorite) {
    return res
      .status(400)
      .json({ message: "This item is already in favorites" });
  }

  const favorite = await Favorite.create({ user: userId, imageUrl });

  res.status(201).json({
    success: true,
    data: favorite,
  });
});

// ลบรายการ Favorite
const deleteFavorite = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params; // ดึง _id ของ favorite จาก params

  console.log("🔍 Deleting Favorite - userId:", userId, "favoriteId:", id);

  if (!id) {
    return res.status(400).json({ message: "Favorite ID is required" });
  }

  const favorite = await Favorite.findOneAndDelete({ _id: id, user: userId });

  if (!favorite) {
    console.log("⚠️ Favorite not found in DB");
    return res.status(404).json({ message: "Favorite not found" });
  }

  console.log("✅ Favorite deleted successfully");
  res.status(200).json({ message: "Favorite removed successfully" });
});

// ดึงรายการ Favorite ทั้งหมดของผู้ใช้
const getAllFavorites = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const favorites = await Favorite.find({ user: userId });

  res.status(200).json(favorites);
});

module.exports = {
  createFavorite,
  getAllFavorites,
  deleteFavorite,
};
