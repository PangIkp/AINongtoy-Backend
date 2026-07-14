const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGO_URI) {
    throw new Error(
      "MONGO_URI is not set. Create AINongtoy-Backend/config/config.env or AINongtoy-Backend/.env with MONGO_URI."
    );
  }
  const conn = await mongoose.connect(process.env.MONGO_URI);

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
