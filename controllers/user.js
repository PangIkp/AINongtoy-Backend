const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

// @desc    Get all users
// @route   GET /api/v1/user
// @access  Public
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Create a user
// @route   POST /api/v1/user
// @access  Public
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "This user already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Get a user profile
// @route   GET /api/v1/user/:id
// @access  Public
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Update a user
// @route   PATCH /api/v1/user/:id
// @access  Public (ควรเปลี่ยนเป็น Protected ถ้าใช้ Authentication)
exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params; // ดึง id จาก URL
    const updates = req.body; // ข้อมูลที่ต้องการอัปเดต

    // ค้นหาผู้ใช้ในฐานข้อมูล
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // อัปเดตฟิลด์ต่าง ๆ
    Object.keys(updates).forEach((key) => {
      user[key] = updates[key];
    });

    // บันทึกข้อมูลใหม่ (middleware pre("save") จะทำงานที่นี่)
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// @desc    Delete a user
// @route   DELETE /api/v1/user/:id
// @access  Public
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "No user found" });
    }

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Check if username, email, or phone number exists
// @route   POST /api/v1/user/check-exists
// @access  Public
exports.checkExists = async (req, res) => {
  try {
    const { username, email, phoneNumber } = req.body;

    if (!username && !email && !phoneNumber) {
      return res.status(400).json({ success: false, message: "At least one field (username, email, phoneNumber) is required" });
    }

    const existingFields = {};

    // ตรวจสอบ username
    if (username) {
      const userWithUsername = await User.findOne({ username });
      if (userWithUsername) {
        existingFields.username = { exists: true, _id: userWithUsername._id };
      } else {
        existingFields.username = { exists: false };
      }
    }

    // ตรวจสอบ email
    if (email) {
      const userWithEmail = await User.findOne({ email });
      if (userWithEmail) {
        existingFields.email = { exists: true, _id: userWithEmail._id };
      } else {
        existingFields.email = { exists: false };
      }
    }

    // ตรวจสอบ phoneNumber
    if (phoneNumber) {
      const userWithPhoneNumber = await User.findOne({ phoneNumber });
      if (userWithPhoneNumber) {
        existingFields.phoneNumber = { exists: true, _id: userWithPhoneNumber._id };
      } else {
        existingFields.phoneNumber = { exists: false };
      }
    }

    return res.status(200).json({
      success: true,
      exists: existingFields,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// for Admin
exports.getAllUsersForAdmin = asyncHandler(async (req, res) => {
  // ตรวจสอบว่า user เป็น admin หรือไม่
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'User does not have admin privileges',
    });
  }
  const users = await User.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: users,
  });
});

exports.updateUserForAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params; // รับ ID ของ User จาก URL
  const updates = req.body; // รับค่าที่ต้องการอัปเดตจาก Body

  // ตรวจสอบว่า user เป็น admin หรือไม่
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "User does not have admin privileges",
    });
  }

  // ค้นหาและอัปเดตเฉพาะฟิลด์ที่ถูกส่งมา
  const updatedUser = await User.findByIdAndUpdate(id, updates, {
    new: true, // คืนค่าข้อมูลที่อัปเดต
    runValidators: true, // ตรวจสอบค่าที่ส่งมาให้ตรงกับ Schema
  });

  // ตรวจสอบว่าพบ user หรือไม่
  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: updatedUser,
  });
});

exports.deleteUserForAdmin = async (req, res) => {
  const { id } = req.params; // รับ ID ของผู้ใช้จาก URL

  try {
    // ตรวจสอบสิทธิ์ของผู้ใช้ก่อนที่จะดำเนินการลบ
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "User does not have admin privileges", // ผู้ใช้ไม่มีสิทธิ์เป็นแอดมิน
      });
    }

    // ลบผู้ใช้ตาม ID
    const deletedUser = await User.findByIdAndDelete(id);

    // ตรวจสอบว่าพบผู้ใช้หรือไม่
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found", // ไม่พบผู้ใช้
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully", // ลบผู้ใช้สำเร็จ
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error", // เกิดข้อผิดพลาดที่เซิร์ฟเวอร์
      error: error.message,
    });
  }
};
