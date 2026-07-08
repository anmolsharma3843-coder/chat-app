import { useEffect, useState } from "react";
import { getGroup } from "../services/groupService";

export const useGroups = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getGroup();
        console.log(data)
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