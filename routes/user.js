const express = require("express");
const { getUsers, createUser, updateUserProfile, deleteUser } = require("../controllers/user");

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.patch("/:id", updateUserProfile);
router.delete("/:id", deleteUser);

module.exports = router;