import UserList from "./UserList";
import GroupList from "../../Group/GroupList";
import CreateGroup from "../../Group/CreateGroup";
import { useEffect, useEffectEvent, useState } from "react";
import GroupSettingsModal from "../../Group/GroupSettingsModal";
import { IoIosSearch } from "react-icons/io";

import ProfileModal from "./ProfileModal";

const Sidebar = ({ currentUser, setCurrentUser, ...props }) => {

  const [show, setshow] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupMembers, setNewGroupMembers] = useState([]);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [ selectedGroupForSettings, setSelectedGroupForSettings, ] = useState(null);
   const [query, setQuery] = useState("");
   const [searchdebounce, setsearchdebounce] = useState("")
  const [results, setResults] = useState({ users: [], groups: [] });
  const [showProfile, setShowProfile] = useState(false);

useEffect(() => {
  if(!query.trim()){
    setsearchdebounce("")
    return
  }
  const timer=setTimeout(() => {
    setsearchdebounce(query)
  }, 200);
  return ()=>{
    clearTimeout(timer)
  }
}, [query])

useEffect(() => {
  const searching = async (searchdebounce) => {
    if (searchdebounce.length > 0) {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/search?q=${searchdebounce}`, { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      } });
      const data = await res.json();
      setResults(data); // <-- store results here
    } else {
      setResults({ users: [], groups: [] });
    }
  };
  searching(searchdebounce);
}, [searchdebounce]);




  const toggleMember = (id) => {
    setNewGroupMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  

 

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* User Header */}
     <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-500">
  <div className="flex justify-between items-center">
   <h1 className="text-xl text-green-500 font-bold">WhatsApp</h1>
    <div
      onClick={() => setShowProfile(true)}
      className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-xl transition"
    >
      {currentUser?.profileImage ? (
        <img
          src={`${import.meta.env.VITE_BASE_URL}${currentUser.profileImage}`}
          alt=""
          className="w-9 h-9 rounded-full object-cover"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">
          {currentUser?.username?.charAt(0).toUpperCase()}
        </div>
      )}

    </div>



   

  </div>
</div>

      {/* Search */}
      <div className="p-4 pb-0">
        <input
          type="text"
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          placeholder="Search chats..."
          className="w-full px-10 py-3 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />
        <IoIosSearch size={25} className="relative -top-9 left-2"/>
      </div>


    
      {/* Groups & Chats*/}
      {query.trim() ? (
  <div className="flex-1 overflow-y-auto border-t border-slate-200 dark:border-slate-500">
    <div className="p-4 pb-2">
      <h3 className="font-semibold text-slate-700 dark:text-gray-200">
        Search Results ({results.users.length + results.groups.length})
      </h3>
    </div>

    {/* Users */}
    <div className="px-2">
      <h4 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">Users</h4>
      {results.users.length > 0 ? (
        results.users.map((u) => (
          <div
            key={u._id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            onClick={() => props.handleSelectUser(u)}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
        {u?.profileImage ? (
        <img
          src={`${import.meta.env.VITE_BASE_URL}${u.profileImage}`}
          alt=""
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">
          {u?.username?.charAt(0).toUpperCase()}
        </div>
      )}
            </div>
            {/* Username */}
            <div className="flex-1">
              <span className="font-medium text-slate-700 dark:text-gray-200">{u.username}</span>
            </div>
            {/* Optional unread badge */}
            {props.unreadCounts?.[u._id] > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {props.unreadCounts[u._id]}
              </span>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm text-center">No users found</p>
      )}
    </div>

    {/* Groups */}
    <div className="px-2 mt-4">
      <h4 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">Groups</h4>
      {results.groups.length > 0 ? (
        results.groups.map((g) => (
          <div
            key={g._id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            onClick={() => props.handleSelectGroup(g)}
          >
            {/* Group Avatar */}
            <div className="relative shrink-0">
              {g?.groupImage ? (
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${g.groupImage}`}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />) : (
                <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold">
                  {g.groupName?.charAt(0).toUpperCase()}
                </div>)}
            </div>
            {/* Group Name */}
            <div className="flex-1">
              <span className="font-medium text-slate-700 dark:text-gray-200">{g.groupName}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm text-center">No groups found</p>
      )}
    </div>
  </div>

) : (   <><div className="flex justify-between items-center">
        <div className="flex items-center  gap-4 px-4 py-3">
          <button onClick={() => setshow(false)} className={`font-semibold text-black dark:text-gray-200  p-2  ${show ? null : "bg-slate-200 dark:bg-slate-700 rounded-xl"}`}>
            Chats
          </button>
          <button onClick={() => setshow(true)} className={`font-semibold text-black dark:text-gray-200  p-2  ${show ? "bg-slate-200 dark:bg-slate-700 rounded-xl" : null}`}>
            Groups
          </button>

        </div>
      </div>
  {show ? <div className="p-4 border-t border-slate-200 dark:border-slate-500  overflow-y-auto">

        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-slate-700 dark:text-gray-200">
            Groups
          </h3>

          <button
            onClick={() => setShowCreateGroup((prev) => !prev)}
            className="text-blue-600 hover:text-blue-700 text-2xl"
          >
            {showCreateGroup ? "✕" : "+"}
          </button>

        </div>

        {showCreateGroup && (
          <CreateGroup
            users={props.users}
            newGroupName={newGroupName}
            onGroupCreated={props.onGroupCreated}
            setNewGroupName={setNewGroupName}
            newGroupMembers={newGroupMembers}
            toggleMember={toggleMember}
            setShowCreateGroup={setShowCreateGroup}
            setNewGroupMembers={setNewGroupMembers}
          />
        )}


        <GroupList
          groups={props.groups}
          selectedGroup={props.selectedGroup}
          handleSelectGroup={
            props.handleSelectGroup
          }
          currentUserId={currentUser._id}
          openGroupSettings={(group) => {
            console.log(
              "Opening settings",
              group
            );

            setSelectedGroupForSettings(
              group
            );

            setShowGroupSettings(true);
          }}
        />
      </div> : <div className="flex-1 overflow-y-auto border-t border-slate-200 dark:border-slate-500">
        <div className="p-4 pb-2">
          <h3 className="font-semibold text-slate-700 dark:text-gray-200">
            Direct Messages
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          <UserList {...props} unreadCounts={props.unreadCounts} />
        </div>
      </div>}</>)}
      {
  showProfile && (
    <ProfileModal
      user={currentUser}
      onClose={() => setShowProfile(false)}
      onProfileUpdated={(updatedUser) => {
        setCurrentUser(updatedUser);
      }}
    />
  )
}
      {showGroupSettings &&
        selectedGroupForSettings && (
         <GroupSettingsModal
  group={selectedGroupForSettings}
  users={props.users}
  currentUser={currentUser}
  onLeaveGroup={props.onLeaveGroup}
  onClose={() => {
    setShowGroupSettings(false);
    setSelectedGroupForSettings(null);
  }}
/>
        )}
        
    </div>

  );
};

export default Sidebar;