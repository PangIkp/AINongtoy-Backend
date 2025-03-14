const express = require("express");
const { protect } = require("../middleware/auth");
const {
  createFavorite,
  getAllFavorites,
  deleteFavorite
} = require("../controllers/favorite");

const router = express.Router();

// Route: เพิ่ม Favorite
router.post("/", protect, createFavorite);

// Route: ดึงข้อมูล Favorite ทั้งหมดของผู้ใช้
router.get("/", protect, getAllFavorites);

// Route: ลบ Favorite ตาม ID
router.delete("/:id", protect, deleteFavorite);

module.exports = router;
