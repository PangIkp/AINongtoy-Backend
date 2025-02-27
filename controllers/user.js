const User = require("../models/User");

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

// @desc    Update a user
// @route   PATCH /api/v1/user/:id
// @access  Public (ควรเปลี่ยนเป็น Protected ถ้าใช้ Authentication)
exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params; // ดึง id จาก URL
    const updates = req.body; // ข้อมูลที่ต้องการอัปเดต

    // ค้นหาและอัปเดตผู้ใช้
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true, // ส่งค่าที่อัปเดตกลับมา
      runValidators: true, // ตรวจสอบ validation ก่อนอัปเดต
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
