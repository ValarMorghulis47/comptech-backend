import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { config as cloudinaryConfig } from 'cloudinary';

dotenv.config();

const DB = process.env.DATABASE_URI
const DB2 = process.env.DATABASE_URI2
const DB_NAME = process.env.DATABASE_NAME


cloudinaryConfig({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const connectToMongodb = async () => {
//   try {
//     await mongoose.connect(DB, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.log("Error in connecting to Mongodb", error.message);
//   }
// };

const connectToMongodb = async () => {
  try {
    await mongoose.connect(`${DB2}/${DB_NAME}`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error in connecting to Mongodb", error.message);
  }
};

connectToMongodb()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at  port : ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => console.log("MongoDB connection failed !!!", error.message));
  