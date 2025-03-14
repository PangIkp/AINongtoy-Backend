const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({ 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ชื่อของ model User
    required: true,
  },

  imageUrl: {
    type: String,
    required: true,
  },

}, {
  timestamps: true, // เพิ่ม createdAt และ updatedAt อัตโนมัติ
});


const Favorite = mongoose.model("Favorite", FavoriteSchema);

module.exports = Favorite;
