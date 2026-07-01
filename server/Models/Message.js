import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },

    text: {
      type: String,
      required: true,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    status: {
      type: String,
      enum: [
        "sent",
        "delivered",
        "read",
      ],
      default: "sent",
    },
    edited: {
  type: Boolean,
  default: false,
},

deleted: {
  type: Boolean,
  default: false,
},
reactions: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    emoji: String,
  },
],
  },
  {
    timestamps: true,
  }
);

export const Message =
  mongoose.models.Message ||
  mongoose.model("Message", messageSchema);