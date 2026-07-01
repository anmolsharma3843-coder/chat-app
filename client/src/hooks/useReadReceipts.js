import { useEffect } from "react";

export const useReadReceipts = (
  socket,
  setConversations
) => {
  useEffect(() => {
    if (!socket) return;

    const handleDelivered = ({
      messageId,
      status,
    }) => {
      setConversations((prev) => {
        const updated = { ...prev };

        Object.keys(updated).forEach(
          (key) => {
            updated[key] = updated[key].map(
              (msg) =>
                msg._id === messageId
                  ? {
                      ...msg,
                      status,
                    }
                  : msg
            );
          }
        );

        return updated;
      });
    };

    const handleRead = ({
      senderId,
      receiverId,
    }) => {
      setConversations((prev) => {
        const updated = { ...prev };

        Object.keys(updated).forEach(
          (key) => {
            updated[key] = updated[key].map(
              (msg) =>
                msg.sender === senderId &&
                msg.receiver ===
                  receiverId
                  ? {
                      ...msg,
                      status: "read",
                    }
                  : msg
            );
          }
        );

        return updated;
      });
    };

    socket.on(
      "message-status-updated",
      handleDelivered
    );

    socket.on(
      "messages-read",
      handleRead
    );

    return () => {
      socket.off(
        "message-status-updated",
        handleDelivered
      );

      socket.off(
        "messages-read",
        handleRead
      );
    };
  }, [socket, setConversations]);
};