const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require('body-parser')
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");

const user = require('./routes/user')
const auth = require('./routes/auth')
const artToy = require('./routes/arttoy'); 
const favorite = require('./routes/favorite'); 
const order = require('./routes/order'); 
const keyword = require('./routes/keyword');

// Add this line

// Load env vars
dotenv.config({ path: "./config/config.env" });

connectDB();

app.use(cors());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

app.use("/api/v1/user", user);
app.use("/api/v1/auth", auth);
app.use("/api/v1/arttoy", artToy);
app.use("/api/v1/favorite", favorite);
app.use("/api/v1/order", order);
app.use("/api/v1/keyword", keyword);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3001;
const server = app.listen(
  PORT,
  console.log(
    "Server running in ",
    process.env.NODE_ENV,
    " mode on port ",
    PORT
  )
);

//Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

//     "cors": "^2.8.5",
// "dotenv": "^16.4.5",
// "express": "^4.19.2",
// "mongoose": "^8.4.1",