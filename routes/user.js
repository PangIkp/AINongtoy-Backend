const express = require("express");
const { getUsers, createUser, updateUserProfile, deleteUser, getUserProfile, getAllUsersForAdmin, updateUserForAdmin } = require("../controllers/user");
const { protect, authorize } = require("../middleware/auth");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.get("/:id", getUserProfile);
router.get("/", getUsers);
router.post("/", createUser);
router.patch("/:id", updateUserProfile);
router.delete("/:id", deleteUser);
router.post("/check-exists", checkExists);

// for Admin
router.get("/admin/users", protect, authorize("admin"), getAllUsersForAdmin);
router.patch("/admin/users/:id", protect, authorize("admin"), updateUserForAdmin);



module.exports = router;
