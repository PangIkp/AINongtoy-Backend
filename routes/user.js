const express = require("express");
const { getUsers, createUser, updateUserProfile, deleteUser } = require("../controllers/user");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.patch("/:id", updateUserProfile);
router.delete("/:id", deleteUser);


// ✅ Register
// router.post("/register", async (req, res) => {
//     try {
//         const { fname, lname, username, email, password } = req.body;

//         if (!fname || !lname || !username || !email || !password) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const userExists = await User.findOne({ email });
//         if (userExists) return res.status(400).json({ message: "User already exists" });

//         const newUser = await User.create({ fname, lname, username, email, password });

//         res.status(201).json({ message: "User registered successfully", userId: newUser._id });
//     } catch (err) {
//         res.status(500).json({ message: "Server error" });
//     }
// });

// ✅ Login
// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ message: "Email and password are required" });
//         }

//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ message: "Invalid credentials" });

//         const isMatch = await user.comparePassword(password);
//         if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//         // 🔹 Generate Token
//         const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//         res.status(200).json({ message: "Login successful", token });
//     } catch (err) {
//         res.status(500).json({ message: "Server error" });
//     }
// });

module.exports = router;
