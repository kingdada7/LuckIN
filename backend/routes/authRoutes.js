import express from "express";
import {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const authRoutes = express.Router();

// Define your authentication routes here

authRoutes.post("/login", loginUser);

authRoutes.post("/register", registerUser);
authRoutes.get("/profile", protect, getUserProfile);
authRoutes.put("/profile", protect, updateUserProfile);

authRoutes.post("/upload-profile-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res
    .status(200)
    .json({ message: "File uploaded successfully", imageUrl });
});

export default authRoutes;
