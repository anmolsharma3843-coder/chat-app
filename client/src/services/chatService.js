const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => {
  return localStorage.getItem("token")
};

// Unread Counts
export const getUnreadCounts = async () => {
  const res = await fetch(`${BASE_URL}/messages/unread-counts`, {
    headers: {
        Authorization: `Bearer ${getToken()}`,
      },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};

// Private Messages
export const getPrivateMessages = async (userId) => {
  const res = await fetch(
    `${BASE_URL}/messages/private/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data.messages;
};

// Group Messages
export const getGroupMessages = async (groupId) => {
  const res = await fetch(
    `${BASE_URL}/messages/group/${groupId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data.messages;
};

// Edit Message
export const editMessageApi = async (messageId, text) => {
  const res = await fetch(
    `${BASE_URL}/messages/${messageId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ text }),
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data.message;
};

// Delete Message
export const deleteMessageApi = async (messageId) => {
  const res = await fetch(
    `${BASE_URL}/messages/${messageId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data.message;
};

// React to Message
export const reactToMessageApi = async (
  messageId,
  emoji
) => {
  const res = await fetch(
    `${BASE_URL}/messages/${messageId}/reaction`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ emoji }),
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data.message;
};