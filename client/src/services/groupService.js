const BASE_URL = import.meta.env.VITE_BASE_URL;

// CREATE GROUP
export const createGroup = async ( formdata ) => {
  try{
  const res = await fetch(`BASE_URL/groups`, {
    method: "POST",
    credentials: "include",
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
    credentials: "include",
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
      credentials: "include",
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
      credentials: "include",
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
        credentials: "include",
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
      credentials: "include",
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
        credentials: "include",
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
        credentials: "include",
        body: formdata,
      }
    );
     if (!res.ok) throw new Error(data.message);

    return await res.json();
    } catch (error) {
      console.error(error);
      
    }
    
  };