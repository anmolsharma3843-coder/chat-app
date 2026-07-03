import { useEffect, useState } from "react";

export const useUsers = (userId) => {
  const [users, setUsers] = useState([]);
const getToken = () => {
  return localStorage.getItem("token");
};
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/users`,
          {
            headers: {
        Authorization: `Bearer ${getToken()}`,
      },
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