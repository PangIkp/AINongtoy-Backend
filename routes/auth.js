const express = require("express");
const { register, login, getMe, logout,googleLogin,facebookLogin } = require("../controllers/auth");
const { protect, checkTokenValidity } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/about", protect, getMe);
router.get("/logout", logout);
router.post("/google-login", googleLogin);
router.post("/facebook-login", facebookLogin);



// Route: ตรวจสอบ Token หมดอายุ
router.get("/check-token", checkTokenValidity);

module.exports = router;