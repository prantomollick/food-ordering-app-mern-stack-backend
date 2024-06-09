import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

import myUserRoute from "./routes/MyUserRoute";
import myRestaurantRoute from "./routes/MyRestaurantRoute";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log("connected to database");
});

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLUDE_NAME,
  api_key: process.env.CLOUDINARY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};

cloudinary.config(cloudinaryConfig);

const app = express();

app.use(cors());

// For parsing application/json
app.use(express.json());

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health ok!" });
});

// /api/my/user
app.use("/api/my/user", myUserRoute);

// /api/my/restaurant
app.use("/api/my/restaurant", myRestaurantRoute);

app.listen(7000, () => {
  console.log("server started on locahost:7000");
});
