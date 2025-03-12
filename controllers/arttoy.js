// controllers/arttoy.js

// สร้าง ArtToy ใหม่
const asyncHandler = require("express-async-handler");
const Arttoy = require("../models/Arttoy");

// ฟังก์ชันที่ใช้สร้าง ArtToy
const createArtToy = asyncHandler(async (req, res, next) => {
  const { 
    name, 
    prompt, 
    size, 
    material, 
    painting, 
    assembly, 
    price, 
    quantity, 
    imageUrl 
  } = req.body;

  const userId = req.user.id; // ใช้ user ID ที่ได้รับจาก middleware

  // คำนวณ totalPrice
  const totalPrice = price * quantity;

  // สร้าง ArtToy ใหม่
  const artToy = await Arttoy.create({
    name, 
    size, 
    material, 
    painting, 
    assembly, 
    quantity, 
    price, 
    imageUrl,
    user: userId, // เชื่อมโยงกับ user ID
  });

  res.status(201).json({
    success: true,
    data: artToy,
  });
});


// ดึงข้อมูล ArtToy ทั้งหมด
const getAllArtToys = async (req, res) => {
  try {
    const userId = req.user.id; // ใช้ user ID ที่ได้รับจาก middleware
    const artToys = await Arttoy.find({ user: userId});  // กรอง ArtToy ตามผู้ใช้
    res.status(200).json(artToys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ดึงข้อมูล ArtToy ตาม ID
const getArtToyById = async (req, res) => {
  try {
    const artToy = await Arttoy.findById(req.params.id);
    if (!artToy) {
      return res.status(404).json({ message: "ArtToy not found" });
    }
    res.status(200).json(artToy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// แก้ไขข้อมูล ArtToy
const updateArtToy = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "prompt", "size", "material", "painting", "assembly", "picture", "price", "quantity"];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).json({ message: "Invalid updates!" });
    }

    const artToy = await Arttoy.findById(req.params.id);
    if (!artToy) {
      return res.status(404).json({ message: "ArtToy not found" });
    }

    updates.forEach((update) => (artToy[update] = req.body[update]));
    await artToy.save();
    res.status(200).json(artToy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ลบ ArtToy
const deleteArtToy = async (req, res) => {
  try {
    const userId = req.user.id; // Retrieve userId from middleware
    const { id } = req.params;

    // ✅ Validate if the ID is in the correct format (ObjectId)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // 🔹 Find the ArtToy by ID and userId
    const artToy = await Arttoy.findOne({ _id: id, user: userId });

    if (!artToy) {
      return res.status(404).json({ message: "ArtToy not found or you do not have permission to delete it" });
    }

    // 🔥 Delete the ArtToy
    await Arttoy.findByIdAndDelete(id);

    res.status(200).json({ message: "ArtToy deleted successfully" });
  } catch (error) {
    console.error("Error deleting ArtToy:", error);
    res.status(500).json({ message: "An error occurred. Please try again later" });
  }
};



module.exports = {
  createArtToy,
  getAllArtToys,
  getArtToyById,
  updateArtToy,
  deleteArtToy
};
