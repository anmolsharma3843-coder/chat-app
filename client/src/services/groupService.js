const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => {
  return localStorage.getItem("token");
};
// CREATE GROUP
export const createGroup = async ( formdata ) => {
  try{
  const res = await fetch(`BASE_URL/groups`, {
    method: "POST",
    headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    body: formdata
  });
  if (!res.ok) {
      throw new Error(
        "Failed to create group"
      );
    }

  return await res.json();
}catch(error){
  console.error(error);
  
}
};

// GET ALL GROUPS
export const getGroups = async () => {
  try {
    const res = await fetch(`BASE_URL/groups`, {
    headers: {
        Authorization: `Bearer ${getToken()}`,
      },
  });

  return await res.json();
  } catch (error) {
    console.error(error);
    
  }
  
};

// GET SINGLE GROUP
export const getGroup = async (
  groupId
) => {
  try {
    const res = await fetch(
    `${BASE_URL}/groups/${groupId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return await res.json();
  } catch (error) {
    console.error(error);
    
  }
  
};

// ADD MEMBER
export const addMember = async (
  groupId,
  memberId
) => {
  try {
    const res = await fetch(
    `${BASE_URL}/groups/${groupId}/add`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        memberId,
      }),
    }
  );

  return await res.json();
  } catch (error) {
    console.error(error);
    
  }
  
};

// REMOVE MEMBER
export const removeMember =
  async (
    groupId,
    memberId
  ) => {
    try {
       const res = await fetch(
      `${BASE_URL}/groups/${groupId}/remove`,
      {
        method: "PATCH",
        headers: {
        Authorization: `Bearer ${getToken()}`,
      },
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          memberId,
        }),
      }
    );

    return await res.json();
    } catch (error) {
      console.error(error);
      
    }
   
  };

// LEAVE GROUP
export const leaveGroup = async (
  groupId
) => {
  try {
     const res = await fetch(
    `${BASE_URL}/groups/${groupId}/leave`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return await res.json();
  } catch (error) {
    console.error(error);
    
  }
 
};

// DELETE GROUP
export const deleteGroup =
  async (groupId) => {
    try {
      const res = await fetch(
      `${BASE_URL}/groups/${groupId}`,
      {
        method: "DELETE",
        headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      }
    );

    return await res.json();
    } catch (error) {
      console.error(error);
      
    }
    
  };
  //rename
  export const updateGroup =
  async (
    groupId,
    formdata
  ) => {
    try {
      const res = await fetch(
      `${BASE_URL}/groups/${groupId}`,
      {
        method: "PATCH",
        headers: {
        Authorization: `Bearer ${getToken()}`,
      },
        body: formdata,
      }
    );
     if (!res.ok) throw new Error(data.message);

    return await res.json();
    } catch (error) {
      console.error(error);
      
    }
    
  };