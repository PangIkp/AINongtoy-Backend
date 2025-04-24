const User = require("../models/User");

//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public
exports.register = async (req, res, next) => {
  try {
    const { username, firstName, lastName, email, password, phoneNumber } =
      req.body;

    // Validate required fields
    if (
      !username ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phoneNumber
    ) {
      return res.status(400).json({
        success: false,
        msg: "Please provide all required fields: username, firstName, lastName, email, password, phoneNumber",
      });
    }

    //Create user
    const user = await User.create(req.body);

    //Create token and send response
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.log(err.stack);

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((el) => el.message);
      return res.status(400).json({ success: false, msg: errors });
    }

    // Handle duplicate key errors (e.g., email, username, phoneNumber)
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0]; // Get the duplicate field name
      return res.status(400).json({
        success: false,
        msg: `The ${field} '${err.keyValue[field]}' is already in use. Please use a different ${field}.`,
      });
    }

    // Other errors
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

exports.googleLogin = async (req, res) => {
  const { email, firstName, lastName} = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        firstName,
        lastName,
        username: email.split("@")[0],
        phoneNumber: "0000000000",
        password: "google_auth",
        authProvider: "google",
      });
    }

    // สร้าง token แล้วส่งกลับ
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Google login failed" });
  }
};

exports.facebookLogin = async (req, res) => {
  const { email, firstName, lastName} = req.body;

  try {
    // ค้นหาผู้ใช้ที่มี email นี้
    let user = await User.findOne({ email });

    // ถ้าผู้ใช้ยังไม่มีในฐานข้อมูล ให้สร้างใหม่
    if (!user) {
      user = await User.create({
        email,
        firstName,
        lastName,
        username: email.split("@")[0], // สร้าง username จาก email
        phoneNumber: "0000000000", // กำหนดหมายเลขโทรศัพท์เป็นค่าเริ่มต้น
        password: "facebook_auth", // กำหนด password เป็นค่าเริ่มต้น
        authProvider: "facebook", // ระบุว่าใช้ Facebook ในการเข้าสู่ระบบ
      });
    }

    // สร้าง token และส่งกลับ
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Facebook login failed" });
  }
};

//@desc     Login user
//@route    POST /api/v1/auth/login
//@access   Public
exports.login = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    // Validate email/username & password
    if ((!email && !username) || !password) {
      return res
        .status(400)
        .json({
          success: false,
          msg: "Please provide an email/username and password",
        });
    }

    // Check for user
    const user = await User.findOne({
      $or: [{ email }, { username }],
    }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials" });
    }

    // Create token
    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "Cannot convert email/username or password to string",
    });
  }
};

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    data: user, // 👈 Backend ส่ง user กลับไป
    token,
  });

  // ✅ Debug ดูค่าที่จะส่งกลับไปยัง Frontend
  console.log("Response Data:", {
    success: true,
    data: user,
    token,
  });
};

//@desc     Get current Logged in user
//@route    POST /api/v1/auth/me
//@access   Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
};

//@desc     Log user out / clear cookie
//@route    GET /api/v1/auth/logout
//@access   Private
exports.logout = async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(0), // หมดอายุทันที
    httpOnly: true, // ป้องกันการเข้าถึงจาก JavaScript ฝั่ง Client
    secure: process.env.NODE_ENV === "production", // ใช้ secure cookie เมื่ออยู่บน HTTPS
    sameSite: "None", // ป้องกันปัญหาเรื่อง Cross-Site Cookie (ถ้าใช้งานข้ามโดเมน)
    path: "/", // เคลียร์ cookie ทุกหน้า
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
