const express = require("express");
const { protect } = require("../middleware/auth");
const {
    createKeyword,
    getKeywords,
} = require("../controllers/keyword");

const router = express.Router();

router.post("/", protect, createKeyword);
router.get("/", getKeywords);

module.exports = router;
