import { useEffect, useState } from "react";

export const useTyping = (
  socket,
  selectedUser
) => {
  const [typing, setTyping] =
    useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleTyping = (senderId) => {
      if (
        selectedUser?._id === senderId
      ) {
        setTyping(true);
      }
    };

    const handleStopTyping = (senderId) => {
      if (
        selectedUser?._id === senderId
      ) {
        setTyping(false);
      }
    };

    socket.on(
      "user-typing",
      handleTyping
    );

    socket.on(
      "user-stop-typing",
      handleStopTyping
    );

    return () => {
      socket.off(
        "user-typing",
        handleTyping
      );

      socket.off(
        "user-stop-typing",
        handleStopTyping
      );
    };
  }, [socket, selectedUser]);

  return typing;
};