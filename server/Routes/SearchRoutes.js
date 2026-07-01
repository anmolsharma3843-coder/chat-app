import express from "express";
import {User} from "../Models/User.js";
import {Group }from "../models/Group.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
const router = express.Router();

// GET /search?q=keyword
router.get("/", isAuthenticated, async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ users: [], groups: [] });

  try {
    const users = await User.find({
      username: { $regex: q, $options: "i" },
      _id: { $ne: req.user._id }   // case-insensitive
    }).limit(10);

    const groups = await Group.find({
      groupName: { $regex: q, $options: "i" },
    }).limit(10);

    res.json({ users, groups });
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
