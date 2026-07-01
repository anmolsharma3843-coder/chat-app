import { useEffect, useState } from "react";

export const useUsers = (userId) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          "http://localhost:4600/users",
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (data.success) {
          setUsers(
            data.users.filter(
              (u) => u._id !== userId
            )
          );
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, [userId]);

  return {
    users,
    setUsers,
  };
};