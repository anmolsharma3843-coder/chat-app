import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      trim: true,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],

    groupImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Group =
  mongoose.models.Group ||
  mongoose.model("Group", groupSchema);