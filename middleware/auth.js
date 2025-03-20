const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token || token === "null") {
    return res.status(401).json({ success: false, message: "Not authorized to access this route" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: "Not authorized to access this route" });
  }
};

// ตรวจสอบว่า Token หมดอายุหรือไม่ และบอกเวลาที่จะหมด
const checkTokenValidity = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || token === "null") {
    return res.status(401).json({ success: false, message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ถอดรหัส Token

    // คำนวณเวลาที่ Token จะหมดอายุ
    const currentTime = Math.floor(Date.now() / 1000); // เวลาปัจจุบันในรูปแบบ UNIX timestamp
    const timeToExpire = decoded.exp - currentTime; // เวลาที่เหลือก่อนหมดอายุ (วินาที)

    res.status(200).json({
      success: true,
      message: "Token is valid",
      expiresIn: timeToExpire, // เวลาที่เหลือก่อนหมดอายุ (วินาที)
      decoded,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token has expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = { protect, checkTokenValidity };

//Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};