import express from "express";
import {
  getAllUsers,
  getDetails,
  retrieveImages,
  uploadImages,
} from "../controller/userController.js";
import { protectedRoute } from "../middleware.js/protectRoutes.js";
import upload from "../middleware.js/upload.js";

const router = express.Router();

router.get("/allUsers", protectedRoute, getAllUsers);
router.get("/:id", protectedRoute, getDetails);
router.post("/upload", upload.array("images"), uploadImages);
router.get("/:username/images", retrieveImages);
export default router;
