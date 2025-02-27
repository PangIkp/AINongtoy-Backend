const express = require("express");
const { getUsers, createUser, updateUserProfile } = require("../controllers/user");
const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.patch("/:id", updateUserProfile);

module.exports = router;