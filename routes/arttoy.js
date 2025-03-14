const express = require("express");
const { protect } = require("../middleware/auth");
const {
  createArtToy,
  getAllArtToys,
  getArtToyById,
  updateArtToy,
  deleteArtToy
} = require("../controllers/arttoy"); // ให้ตรวจสอบว่าไฟล์นี้ถูกต้อง

const router = express.Router();

// Route: สร้าง ArtToy ใหม่
router.post("/", protect, createArtToy);

// Route: ดึงข้อมูล ArtToy ทั้งหมด
router.get("/",protect, getAllArtToys);

// Route: ดึงข้อมูล ArtToy ตาม ID
router.get("/:id",protect, getArtToyById);

// Route: แก้ไขข้อมูล ArtToy
router.patch("/:id",protect, updateArtToy);

// Route: ลบ ArtToy
router.delete("/:id",protect, deleteArtToy);

module.exports = router;
