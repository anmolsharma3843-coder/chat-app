// routes/groupRoutes.js

import express from "express";
import {
  createGroup,
  getGroups,
  getSingleGroup,
  addMember,
  removeMember,
  leaveGroup,
  deleteGroup,
 updateGroup
} from "../controllers/groupController.js";

// import auth middleware
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { uploadGroupProfile } from "../middleware/uploadMiddleware.js";

const router = express.Router();
router.post(
  "/",
  isAuthenticated,
  uploadGroupProfile.single("groupImage"),
  createGroup
);

router.get("/", isAuthenticated, getGroups);

router.get("/:id", isAuthenticated, getSingleGroup);

router.patch("/:id/add", isAuthenticated, addMember);

router.patch("/:id/remove", isAuthenticated, removeMember);

router.patch("/:id/leave", isAuthenticated, leaveGroup);

router.delete("/:id", isAuthenticated, deleteGroup);

router.patch(
  "/:id",
  isAuthenticated,
 uploadGroupProfile.single("groupImage"),
  updateGroup
);

export default router;