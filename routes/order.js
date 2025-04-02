const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
    createOrder,getOrderByUserId,getOrderById,getAllOrdersForAdmin,deleteOrderByAdmin,updateOrderByAdmin
} = require("../controllers/order");

const router = express.Router();

// Route: เพิ่ม Order
router.post("/", protect, createOrder);
router.get("/", protect, getOrderByUserId);
router.get("/:id",protect, getOrderById);


// for admin
router.get("/admin/orders", protect, authorize("admin"), getAllOrdersForAdmin);
router.delete("/admin/orders/:id", protect, authorize("admin"), deleteOrderByAdmin);
router.patch("/admin/orders/:id", protect, authorize("admin"), updateOrderByAdmin);



module.exports = router;
