// socket/socketHandler.js

import { Message } from "../Models/Message.js";
import { User } from "../Models/User.js";

const onlineUsers = new Map();

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // USER JOINS
    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);

      io.emit(
        "online-users",
        [...onlineUsers.keys()]
      );
    });
    // PRIVATE MESSAGE
    socket.on("private-message", async (data) => {
      try {
        const { sender, receiver, text, replyTo, } = data;
        const message = await Message.create({ sender, receiver, text, replyTo, status: "sent", });

        const populatedMessage =
          await Message.findById(message._id)
            .populate("replyTo", "text")
            .populate("sender", "username")
            .populate("receiver", "username");

        const formattedMessage = {
          ...populatedMessage.toObject(),
          time: new Date(
            populatedMessage.createdAt
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        const receiverSocket =
          onlineUsers.get(receiver);

        if (receiverSocket) {
          io.to(receiverSocket).emit(
            "receive-private-message",
            formattedMessage
          );
        }
        socket.emit(
          "receive-private-message",
          formattedMessage
        );
      } catch (error) {
        console.log(error);
      }
    });
    // JOIN GROUP ROOM
    socket.on("join-group", (groupId) => {
      socket.join(groupId);

      console.log(
        `${socket.id} joined group ${groupId}`
      );
    });
    // GROUP MESSAGE
    socket.on("group-message", async (data) => {
      try {
        const { sender, groupId, text, replyTo, } = data;

        const message = await Message.create({ sender, groupId, text, replyTo, });

        const populatedMessage =
          await Message.findById(message._id)
            .populate("replyTo", "text")
            .populate("sender", "username");

        const formattedMessage = {
          ...populatedMessage.toObject(),
          groupId,
          time: new Date(
            populatedMessage.createdAt
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        io.to(groupId).emit(
          "receive-group-message",
          formattedMessage
        );
      } catch (error) {
        console.log(error);
      }
    });
    // TYPING
    socket.on("typing", ({ sender, senderName, receiver, groupId, }) => {
      // Private chat
      if (receiver) {
        const receiverSocket =
          onlineUsers.get(receiver);

        if (receiverSocket) {
          io.to(receiverSocket).emit(
            "user-typing",
            sender
          );
        }
      }

      // Group chat
      if (groupId) {
        socket.to(groupId).emit( "group-typing", { sender, senderName, groupId, } );
      }
    }
    );
    // STOP TYPING
    socket.on("stop-typing", ({ sender, receiver, groupId, }) => {
      if (receiver) {
        const receiverSocket =
          onlineUsers.get(receiver);

        if (receiverSocket) {
          io.to(receiverSocket).emit( "user-stop-typing", sender );
        }
      }

      if (groupId) {
        socket.to(groupId).emit( "group-stop-typing", { sender, groupId, } );
      }
    }
    );


    //send message
    socket.on("message-delivered", async (messageId) => {
      try {
        const message =
          await Message.findByIdAndUpdate(
            messageId,
            { status: "delivered" },
            { new: true }
          );

        if (!message) return;

        const senderSocket =
          onlineUsers.get(
            message.sender.toString()
          );

        if (senderSocket) {
          io.to(senderSocket).emit(
            "message-status-updated",
            {
              messageId,
              status: "delivered",
            }
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    );

    socket.on("mark-read", async ({ senderId, receiverId, }) => {
      try {
        await Message.updateMany(
          {
            sender: senderId,
            receiver: receiverId,
            status: {
              $ne: "read",
            },
          },
          {
            status: "read",
          }
        );

        const senderSocket =
          onlineUsers.get(senderId);

        if (senderSocket) {
          io.to(senderSocket).emit(
            "messages-read",
            {
              senderId,
              receiverId,
            }
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    );
    // EDIT MESSAGE
    socket.on("message-edited", async (updatedMessage) => {
      try {
        if (updatedMessage.receiver) {
          const receiverSocket = onlineUsers.get(
            updatedMessage.receiver._id ||
            updatedMessage.receiver.toString()
          );

          if (receiverSocket) {
            io.to(receiverSocket).emit(
              "message-edited",
              updatedMessage
            );
          }

          socket.emit(
            "message-edited",
            updatedMessage
          );
        }

        if (updatedMessage.groupId) {
          io.to(updatedMessage.groupId.toString()).emit( "message-edited", updatedMessage );
        }
      } catch (err) {
        console.log(err);
      }
    });
    // DELETE MESSAGE
    // MESSAGE DELETED (Broadcast Only)
    socket.on("message-deleted", async (updatedMessage) => {
      try {
        if (updatedMessage.receiver) {
          const receiverSocket = onlineUsers.get(
            updatedMessage.receiver._id ||
            updatedMessage.receiver.toString()
          );

          if (receiverSocket) {
            io.to(receiverSocket).emit(
              "message-deleted",
              updatedMessage
            );
          }

          socket.emit(
            "message-deleted",
            updatedMessage
          );
        }

        if (updatedMessage.groupId) {
          io.to(
            updatedMessage.groupId.toString()
          ).emit(
            "message-deleted",
            updatedMessage
          );
        }
      } catch (err) {
        console.log(err);
      }
    });
    // MESSAGE REACTION
    socket.on("message-reacted", (updatedMessage) => {
      try {
        if (updatedMessage.receiver) {
          const receiverSocket = onlineUsers.get(
            updatedMessage.receiver._id ||
            updatedMessage.receiver.toString()
          );

          if (receiverSocket) {
            io.to(receiverSocket).emit(
              "message-reacted",
              updatedMessage
            );
          }

          socket.emit(
            "message-reacted",
            updatedMessage
          );
        }

        if (updatedMessage.groupId) {
          io.to(
            updatedMessage.groupId.toString()
          ).emit(
            "message-reacted",
            updatedMessage
          );
        }
      } catch (err) {
        console.log(err);
      }
    });


    // ----------------------------
    // DISCONNECT
    // ----------------------------
    socket.on("disconnect", async () => {
      for (const [userId, socketId] of onlineUsers) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          await User.findByIdAndUpdate(
            userId,
            {
              lastSeen: new Date(),
            }
          );
          break;
        }
      }

      io.emit(
        "online-users",
        [...onlineUsers.keys()]
      );

      console.log(
        "Disconnected:",
        socket.id
      );
    });
  });
};