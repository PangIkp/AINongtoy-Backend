const express = require("express");
const { register, login, getMe, logout } = require("../controllers/auth");
const { protect, checkTokenValidity } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/about", protect, getMe);
router.get("/logout", logout);

// Route: ตรวจสอบ Token หมดอายุ
router.get("/check-token", checkTokenValidity);

module.exports = router;