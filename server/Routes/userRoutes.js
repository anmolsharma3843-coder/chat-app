// routes/userRoutes.js

import express from "express";

import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getAllUsers,
} from "../Controllers/userController.js";

import { isAuthenticated } from "../middleware/authmiddleware.js";
import {uploadProfile } from "../middleware/uploadMiddleware.js"
const router = express.Router();

// Public Routes
router.post("/register",registerUser);
router.post("/login", loginUser);

// Protected Routes
router.get("/profile", isAuthenticated, getProfile);

router.patch("/profile", isAuthenticated,  uploadProfile.single("profileImage"), updateProfile);

router.get("/", isAuthenticated, getAllUsers);

export default router;