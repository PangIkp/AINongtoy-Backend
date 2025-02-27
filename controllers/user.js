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