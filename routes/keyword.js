const express = require("express");
const { protect, authorize  } = require("../middleware/auth");
const {
    createKeyword,
    getKeywords,
    deleteKeywordByAdmin,
    getKeywordsForAdmin,
    updateKeywordByAdmin
} = require("../controllers/keyword");

const router = express.Router();

router.get("/", getKeywords);

// for admin
router.post('/admin/keyword', protect,authorize("admin"), createKeyword);
router.get("/admin/keywords", protect, authorize("admin"), getKeywordsForAdmin);
router.delete("/admin/keyword/:id", protect, authorize("admin"), deleteKeywordByAdmin);
router.patch("/admin/keyword/:id", protect, authorize("admin"), updateKeywordByAdmin);


module.exports = router;
