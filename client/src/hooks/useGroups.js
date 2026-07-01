import { useEffect, useState } from "react";

export const useGroups = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(
          "http://localhost:4600/groups",
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setGroups(data);
        } else if (data.groups) {
          setGroups(data.groups);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchGroups();
  }, []);
    const handleGroupCreated = (newGroup) => {
  setGroups((prev) => [...prev, newGroup]);
};

  return {
    groups,
    setGroups,
    handleGroupCreated
  };
};