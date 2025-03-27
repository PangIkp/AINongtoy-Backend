const express = require("express");
const { getUsers, createUser, updateUserProfile, deleteUser, getUserProfile, checkExists } = require("../controllers/user");

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

module.exports = router;
