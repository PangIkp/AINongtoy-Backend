const asyncHandler = require("express-async-handler");
const Keyword = require("../models/KeywordPrompt");
const mongoose = require("mongoose");

const getKeywords = async (req, res) => {
  try {
    const keywords = await Keyword.find();
    res.status(200).json(keywords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// for admin

const createKeyword = async (req, res) => {
    try {
      const user = req.user; // ดึงจาก JWT หรือ middleware auth
  
      if (!user || user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Only admin can create keywords" });
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

const getKeywordsForAdmin = async (req, res) => {
  try {
    const user = req.user; // ดึง user จาก middleware auth

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can access all keywords" });
    }

    const keywords = await Keyword.find();
    res.status(200).json(keywords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteKeywordByAdmin = async (req, res) => {
  try {
    const user = req.user; // ดึง user จาก middleware auth

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can delete keywords" });
    }

    const keywordId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(keywordId)) {
      return res.status(400).json({ message: "Invalid keyword ID" });
    }

    const deletedKeyword = await Keyword.findByIdAndDelete(keywordId);

    if (!deletedKeyword) {
      return res.status(404).json({ message: "Keyword not found" });
    }

    res.status(200).json({ message: "Keyword deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateKeywordByAdmin = async (req, res) => {
    try {
        const user = req.user; 
    
        if (!user || user.role !== "admin") {
        return res
            .status(403)
            .json({ message: "Only admin can update keywords" });
        }
    
        const keywordId = req.params.id;
    
        if (!mongoose.Types.ObjectId.isValid(keywordId)) {
        return res.status(400).json({ message: "Invalid keyword ID" });
        }
    
        const updatedKeyword = await Keyword.findByIdAndUpdate(
        keywordId,
        req.body,
        { new: true }
        );
    
        if (!updatedKeyword) {
        return res.status(404).json({ message: "Keyword not found" });
        }
    
        res.status(200).json(updatedKeyword);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
    };

module.exports = {
  createKeyword,
  getKeywords,
  getKeywordsForAdmin,
  deleteKeywordByAdmin,
  updateKeywordByAdmin
};
