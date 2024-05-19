import express from "express";
import multer from "multer";
import myResturentController from "../controllers/MyRestaturantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();

//Configure storage destination (disk storage is used in this example

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 //5mb
  }
});

// /api/myresturant
router.post(
  "/",
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  upload.single("imageFile"),
  myResturentController.createMyResturent
);

export default router;
