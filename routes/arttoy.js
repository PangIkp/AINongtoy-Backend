const express = require("express");
const {
  createArtToy,
  getAllArtToys,
  getArtToyById,
  updateArtToy,
  deleteArtToy
} = require("../controllers/arttoy"); // ให้ตรวจสอบว่าไฟล์นี้ถูกต้อง

const router = express.Router();

// Route: สร้าง ArtToy ใหม่
router.post("/arttoys", createArtToy);

// Route: ดึงข้อมูล ArtToy ทั้งหมด
router.get("/arttoys", getAllArtToys);

// Route: ดึงข้อมูล ArtToy ตาม ID
router.get("/arttoys/:id", getArtToyById);

// Route: แก้ไขข้อมูล ArtToy
router.patch("/arttoys/:id", updateArtToy);

// Route: ลบ ArtToy
router.delete("/arttoys/:id", deleteArtToy);

module.exports = router;
