const express = require("express");
const { protect } = require("../middleware/auth");
const {
    createOrder,
} = require("../controllers/order");

const router = express.Router();

// Route: เพิ่ม Order
router.post("/", protect, createOrder);


module.exports = router;
