import express from "express";

import {
  sendPrivateMessage,
  getPrivateMessages,
  sendGroupMessage,
  getGroupMessages,
  getUnreadCounts,
  editMessage,
  deleteMessage,
  reactToMessage,
} from "../Controllers/messageController.js";

import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// --------------------
// Unread Counts
// --------------------
router.get(
  "/unread-counts",
  isAuthenticated,
  getUnreadCounts
);

// --------------------
// Private Chat
// --------------------
router.post(
  "/private",
  isAuthenticated,
  sendPrivateMessage
);

router.get(
  "/private/:userId",
  isAuthenticated,
  getPrivateMessages
);

// --------------------
// Group Chat
// --------------------
router.post(
  "/group",
  isAuthenticated,
  sendGroupMessage
);

router.get(
  "/group/:groupId",
  isAuthenticated,
  getGroupMessages
);

// --------------------
// Edit Message
// --------------------
router.patch(
  "/:messageId",
  isAuthenticated,
  editMessage
);

// --------------------
// Delete Message
// --------------------
router.delete(
  "/:messageId",
  isAuthenticated,
  deleteMessage
);

// --------------------
// React to Message
// --------------------
router.patch(
  "/:messageId/reaction",
  isAuthenticated,
  reactToMessage
);

export default router;