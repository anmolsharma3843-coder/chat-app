import { useEffect, useState } from "react";
import { CONNECTWS } from "../ws";

export const useSocket = (userId) => {
  const [socket, setSocket] =
    useState(null);

  const [onlineUsers, setOnlineUsers] =
    useState([]);

  useEffect(() => {
    const s = CONNECTWS();

    setSocket(s);

    s.on("connect", () => {
      s.emit("join", userId);
    });

    s.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      s.disconnect();
    };
  }, [userId]);

  return {
    socket,
    onlineUsers,
  };
};