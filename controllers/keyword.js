const asyncHandler = require("express-async-handler");
const Keyword = require("../models/KeywordPrompt");
const mongoose = require("mongoose");

const createKeyword = async (req, res) => {
  try {
    const user = req.user; // ดึงจาก JWT หรือ middleware auth

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can create keywords" });
    }

    const newKeyword = new Keyword({
      name: req.body.name,
      type: req.body.type,
      createdBy: user._id,
    });

    await newKeyword.save();
    res.status(201).json(newKeyword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getKeywords = async (req, res) => {
  try {
    const keywords = await Keyword.find();
    res.status(200).json(keywords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
    createKeyword,
    getKeywords,
  };