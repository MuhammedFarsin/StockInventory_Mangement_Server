const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
const fs = require('fs');

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURL = process.env.MONGODB_ATLAS_URL
    if (!mongoURL) {
      throw new Error("MONGODB_URL is not defined in the .env file");
    }

    await mongoose.connect(mongoURL);
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
    // Accept only PNG and JPG files
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(new Error('Only PNG and JPEG files are allowed'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
module.exports = { connectDB, upload };
