// controllers/messageController.js

import { Message } from "../Models/Message.js";


// Send Private Message
export const sendPrivateMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body;

    if (!receiver || !text) {
      return res.status(400).json({
        success: false,
        message: "Receiver and text are required",
      });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver,
      text,
      status: "sent",
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};


// Get Private Messages
export const getPrivateMessages = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        {
          sender: req.user._id,
          receiver: otherUserId,
        },
        {
          sender: otherUserId,
          receiver: req.user._id,
        },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "username")
      .populate("receiver", "username")
      .populate("replyTo", "text")
      .populate("reactions.user", "username");
      

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};


// Send Group Message
export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId, text } = req.body;

    if (!groupId || !text) {
      return res.status(400).json({
        success: false,
        message: "Group ID and text are required",
      });
    }

    const message = await Message.create({
      sender: req.user._id,
      groupId,
      text,
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to send group message",
    });
  }
};


// Get Group Messages
export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await Message.find({
      groupId,
    })
      .sort({ createdAt: 1 })
      .populate("sender", "username")
      .populate("replyTo", "text")
      .populate("reactions.user", "username");

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch group messages",
    });
  }
};
export const getUnreadCounts = async (req, res) => {
  try {
    const userId = req.user._id;

    const counts =
      await Message.aggregate([
        {
          $match: {
            receiver: userId,
            status: { $ne: "read" },
          },
        },
        {
          $group: {
            _id: "$sender",
            count: { $sum: 1 },
          },
        },
      ]);

    res.json(counts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Edit Message
export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message text is required",
      });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Only sender can edit
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own messages",
      });
    }

    if (message.deleted) {
      return res.status(400).json({
        success: false,
        message: "Deleted messages cannot be edited",
      });
    }

    message.text = text;
    message.edited = true;

    await message.save();
    await message.populate([
      { path: "sender", select: "username" },
      { path: "receiver", select: "username" },
      { path: "replyTo", select: "text" },
      { path: "reactions.user", select: "username" },
    ]);
    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to edit message",
    });
  }
};


// Delete Message (Soft Delete)
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Only sender can delete
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own messages",
      });
    }

    message.text = "🚫 This message was deleted";
    message.deleted = true;
    message.edited = false;

    await message.save();

    await message.populate([
  { path: "sender", select: "username" },
  { path: "receiver", select: "username" },
  { path: "replyTo", select: "text" },
  { path: "reactions.user", select: "username" },
]);

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
};
// React to Message
export const reactToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Remove existing reaction from this user
    message.reactions = message.reactions.filter(
      (reaction) =>
        reaction.user.toString() !==
        req.user._id.toString()
    );

    // Add new reaction (if emoji exists)
    if (emoji) {
      message.reactions.push({
        user: req.user._id,
        emoji,
      });
    }

    await message.save();

    await message.populate([
  { path: "sender", select: "username" },
  { path: "receiver", select: "username" },
  { path: "replyTo", select: "text" },
  { path: "reactions.user", select: "username" },
]);

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to react to message",
    });
  }
};