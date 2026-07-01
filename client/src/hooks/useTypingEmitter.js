import { useEffect, useRef } from "react";

export const useTypingEmitter = (
  socket,
  input,
  currentUserId,
  currentUsername,
  selectedUser,
  selectedGroup
) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!socket || !input.trim()) return;

    // Private Chat
    if (selectedUser) {
      socket.emit("typing", {
        sender: currentUserId,
        senderName: currentUsername,
        receiver: selectedUser._id,
      });

      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        socket.emit("stop-typing", {
          sender: currentUserId,
          receiver: selectedUser._id,
        });
      }, 1000);
    }

    // Group Chat
    if (selectedGroup) {
      socket.emit("typing", {
        sender: currentUserId,
        senderName: currentUsername,
        groupId: selectedGroup._id,
      });

      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        socket.emit("stop-typing", {
          sender: currentUserId,
          groupId: selectedGroup._id,
        });
      }, 1000);
    }

    return () =>
      clearTimeout(timeoutRef.current);
  }, [
    input,
    socket,
    currentUserId,
    currentUsername,
    selectedUser,
    selectedGroup,
  ]);
};