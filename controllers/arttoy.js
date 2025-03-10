// controllers/arttoy.js

const Arttoy = require("../models/Arttoy");

// สร้าง ArtToy ใหม่
const createArtToy = async (req, res) => {
  try {
    const { name, prompt, size, material, painting, assembly, picture, price, quantity } = req.body;

    const newArtToy = new Arttoy({
      name,
      prompt,
      size,
      material,
      painting,
      assembly,
      picture,
      price,
      quantity
    });

    await newArtToy.save();
    res.status(201).json(newArtToy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ดึงข้อมูล ArtToy ทั้งหมด
const getAllArtToys = async (req, res) => {
  try {
    const artToys = await ArtToy.find();
    res.status(200).json(artToys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ดึงข้อมูล ArtToy ตาม ID
const getArtToyById = async (req, res) => {
  try {
    const artToy = await ArtToy.findById(req.params.id);
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

    const artToy = await ArtToy.findById(req.params.id);
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
    const artToy = await ArtToy.findByIdAndDelete(req.params.id);
    if (!artToy) {
      return res.status(404).json({ message: "ArtToy not found" });
    }
    res.status(200).json({ message: "ArtToy deleted", artToy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createArtToy,
  getAllArtToys,
  getArtToyById,
  updateArtToy,
  deleteArtToy
};
