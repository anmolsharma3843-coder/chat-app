import { useState, useEffect } from "react";
import { useUsers } from "./useUsers";
import { useGroups } from "./useGroups";
import { useSocket } from "./useSocket";
import { useTyping } from "./useTyping";
import { useReadReceipts } from "./useReadReceipts";
import {
  getUnreadCounts,
  getPrivateMessages,
  getGroupMessages,
  editMessageApi,
  deleteMessageApi,
  reactToMessageApi,
} from "../services/chatService";

export const useChat = (user) => {
  const { users } = useUsers(user._id);
  const { groups, setGroups } =
    useGroups();

  const { socket, onlineUsers } =
    useSocket(user._id);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [conversations, setConversations,] = useState({});
  useReadReceipts(socket, setConversations);
  const [replyMessage, setReplyMessage] = useState(null);
  const typing = useTyping(
    socket,
    selectedUser
  );
  const [groupTyping, setGroupTyping] =
    useState(null);
  useEffect(() => {
    const loadUnread = async () => {
     const data = await getUnreadCounts();

      const counts = {};

      data.forEach((item) => {
        counts[item._id] = item.count;
      });

      setUnreadCounts(counts);
    };

    loadUnread();
  }, []);
  useEffect(() => {
    if (!socket) return;
    const handleGroupTyping = ({
      senderName,
      groupId,
    }) => {
      if (
        selectedGroup &&
        selectedGroup._id === groupId
      ) {
        setGroupTyping(senderName);

        clearTimeout(
          window.groupTypingTimeout
        );

        window.groupTypingTimeout =
          setTimeout(() => {
            setGroupTyping(null);
          }, 2000);
      }
    };

    const handleGroupStopTyping =
      ({ groupId }) => {
        if (
          selectedGroup &&
          selectedGroup._id === groupId
        ) {
          setGroupTyping(null);
        }
      };

    const handlePrivateMessage = (msg) => {
      console.log(
        "PRIVATE MESSAGE RECEIVED",
        msg
      );
      const senderId =
        typeof msg.sender === "object"
          ? msg.sender._id
          : msg.sender;

      const receiverId =
        typeof msg.receiver === "object"
          ? msg.receiver._id
          : msg.receiver;

      if (senderId !== user._id) {
        socket.emit(
          "message-delivered",
          msg._id
        );
      }

      if (
        senderId !== user._id &&
        selectedUser?._id !== senderId
      ) {
        setUnreadCounts((prev) => ({
          ...prev,
          [senderId]:
            (prev[senderId] || 0) + 1,
        }));
      }

      const otherUser =
        senderId === user._id
          ? receiverId
          : senderId;

      setConversations((prev) => ({
        ...prev,
        [otherUser]: [
          ...(prev[otherUser] || []),
          msg,
        ],
      }));
    };

    const handleGroupMessage = (msg) => {
      console.log("GROUP MESSAGE:", msg);
      setConversations((prev) => ({
        ...prev,
        [msg.groupId]: [
          ...(prev[msg.groupId] || []),
          msg,
        ],
      }));
    };
    socket.on(
      "group-typing",
      handleGroupTyping
    );

    socket.on(
      "group-stop-typing",
      handleGroupStopTyping
    );
    socket.on(
      "receive-private-message",
      handlePrivateMessage
    );

    socket.on(
      "receive-group-message",
      handleGroupMessage
    );
    const handleEditedMessage = (updatedMsg) => {
      setConversations((prev) => {
        const updated = {};

        for (const key in prev) {
          updated[key] = prev[key].map((msg) =>
            msg._id === updatedMsg._id ? updatedMsg : msg
          );
        }

        return updated;
      });
    };

    const handleDeletedMessage = (updatedMsg) => {
      setConversations((prev) => {
        const updated = {};

        for (const key in prev) {
          updated[key] = prev[key].map((msg) =>
            msg._id === updatedMsg._id ? updatedMsg : msg
          );
        }

        return updated;
      });
    };
    const handleReactionMessage = (updatedMsg) => {
      setConversations((prev) => {
        const updated = {};

        for (const key in prev) {
          updated[key] = prev[key].map((msg) =>
            msg._id === updatedMsg._id ? updatedMsg : msg
          );
        }

        return updated;
      });
    };

    socket.on("message-edited", handleEditedMessage);
    socket.on("message-deleted", handleDeletedMessage);
    socket.on("message-reacted", handleReactionMessage);

    return () => {
      socket.off(
        "receive-private-message",
        handlePrivateMessage
      );

      socket.off(
        "receive-group-message",
        handleGroupMessage
      );

      socket.off(
        "group-typing",
        handleGroupTyping
      );

      socket.off(
        "group-stop-typing",
        handleGroupStopTyping
      );
      socket.off(
        "message-edited",
        handleEditedMessage
      );

      socket.off(
        "message-deleted",
        handleDeletedMessage
      );
      socket.off(
        "message-reacted",
        handleReactionMessage
      );
    };
  }, [socket, user._id, selectedUser,
    selectedGroup,]);

  const sendMessage = (
    input,
    setInput
  ) => {
    if (!input?.trim()) return;
    if (selectedUser) {
      socket.emit("private-message", {
        sender: user._id,
        receiver: selectedUser._id,
        text: input,
        replyTo: replyMessage?._id,
      });
    }

    if (selectedGroup) {
      socket.emit("group-message", {
        sender: user._id,
        groupId: selectedGroup._id,
        text: input,
        replyTo: replyMessage?._id,
      });
    }

    setInput("");
    setReplyMessage(null);
  };
  const editMessage = async (messageId, text) => {
   try {
  const message = await editMessageApi(messageId, text);

  setConversations((prev) => {
    const updated = {};

    for (const key in prev) {
      updated[key] = prev[key].map((msg) =>
        msg._id === messageId ? message : msg
      );
    }

    return updated;
  });

  socket.emit("message-edited", message);
} catch (err) {
  alert(err.message);
}
  };

  const deleteMessage = async (messageId) => {
  try {
  const message = await deleteMessageApi(messageId);
   console.log(message);
   
  setConversations((prev) => {
    const updated = {};

    for (const key in prev) {
      updated[key] = prev[key].map((msg) =>
        msg._id === messageId ? message : msg
      );
    }

    return updated;
  });

  socket.emit("message-deleted", message);
} catch (err) {
  alert(err.message);
}
  };

  const reactToMessage = async (
    messageId,
    emoji
  ) => {
   try {
  const message = await reactToMessageApi(
    messageId,
    emoji
  );

  setConversations((prev) => {
    const updated = {};

    for (const key in prev) {
      updated[key] = prev[key].map((msg) =>
        msg._id === messageId ? message : msg
      );
    }

    return updated;
  });

  socket.emit("message-reacted", message);
} catch (err) {
  alert(err.message);
}
  };
  const handleSelectUser =
    async (u) => {
      setSelectedGroup(null);
      setSelectedUser(u);
      setUnreadCounts((prev) => ({
        ...prev,
        [u._id]: 0,
      }));
      socket.emit("mark-read", {
        senderId: u._id,
        receiverId: user._id,
      });

      const messages = await getPrivateMessages(u._id);

setConversations((prev) => ({
  ...prev,
  [u._id]: messages,
}));
    };

  const handleSelectGroup = async (g) => {
    setSelectedUser(null);
    setSelectedGroup(g);

    socket.emit("join-group", g._id);

    const messages = await getGroupMessages(g._id);

setConversations((prev) => ({
  ...prev,
  [g._id]: messages,
}));
  };
  const handleGroupCreated = (group) => {
    setGroups((prev) => [...prev, group]);

    socket.emit(
      "join-group",
      group._id
    );
  };
  const handleLeaveGroup = (groupId) => {
    setGroups((prev) =>
      prev.filter((g) => g._id !== groupId)
    );

    setSelectedGroup((prev) =>
      prev?._id === groupId ? null : prev
    );
  };
  return {
    users,
    groups,
    onlineUsers,
    typing,
    groupTyping,
    selectedUser,
    selectedGroup,
    conversations,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    handleSelectUser,
    handleSelectGroup,
    handleGroupCreated,
    socket,
    setGroups,
    unreadCounts,
    replyMessage,
    setReplyMessage,
    handleLeaveGroup
  };
};