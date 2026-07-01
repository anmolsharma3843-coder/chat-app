const BASE_URL = import.meta.env.VITE_BASE_URL;

// Unread Counts
export const getUnreadCounts = async () => {
  const res = await fetch(`${BASE_URL}/messages/unread-counts`, {
    credentials: "include",
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
      credentials: "include",
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
      credentials: "include",
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
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
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
      credentials: "include",
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
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emoji }),
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data.message;
};