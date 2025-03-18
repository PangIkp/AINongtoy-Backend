const express = require("express");
const { protect } = require("../middleware/auth");
const {
    createOrder,getOrderByUserId
} = require("../controllers/order");

const router = express.Router();

// Route: เพิ่ม Order
router.post("/", protect, createOrder);
router.get("/", protect, getOrderByUserId);


module.exports = router;
