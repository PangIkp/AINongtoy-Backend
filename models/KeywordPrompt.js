const mongoose = require("mongoose");

const KeywordPromptSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Character", "Color"],
      default: "Character",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Keyword = mongoose.model("Keyword", KeywordPromptSchema);
module.exports = Keyword;
