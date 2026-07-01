import { useState } from "react";
import { useChat } from "./hooks/useChat";

import Sidebar from "./components/Sidebar/Sidebar";
import ChatHeader from "./components/chat/ChatHeader";
import MessageList from "./components/chat/MessageList";
import MessageInput from "./components/chat/MessageInput";
import { useTypingEmitter } from "./hooks/useTypingEmitter";
import { useEffect } from "react";

const ChatApp = ({ user }) => {
  const [input, setInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [currentuser, setCurrentUser] = useState(user);
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const {
    users,
    groups,
    onlineUsers,
    typing,
    groupTyping,
    selectedUser,
    selectedGroup,
    conversations,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    handleSelectUser,
    handleSelectGroup,
    handleGroupCreated,
    socket,
    setGroups,
    unreadCounts,
    replyMessage,
    setReplyMessage,
    handleLeaveGroup
  } = useChat(currentuser);
  useTypingEmitter(
    socket,
    input,
    currentuser._id,
    selectedUser
  );

  const currentConversation = selectedUser
    ? conversations[selectedUser._id] || []
    : selectedGroup
      ? conversations[selectedGroup._id] || []
      : [];

  const selectUser = (userData) => {
    setShowChat(true);
    handleSelectUser(userData);

  };

  const selectGroup = (groupData) => {
    setShowChat(true);
    handleSelectGroup(groupData);

  };

  const handleBack = () => {
    setShowChat(false);
  };
  

  return (
    <div className="h-screen bg-slate-100 flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          ${showChat ? "hidden md:block" : "block"}
          w-full md:w-[320px] bg-white md:border-r border-slate-200 shadow-md
        `}
      >
        <Sidebar
          users={users}
          groups={groups}
          onlineUsers={onlineUsers}
          selectedUser={selectedUser}
          selectedGroup={selectedGroup}
          handleSelectUser={selectUser}
          handleSelectGroup={selectGroup}
          currentUser={currentuser}
          setCurrentUser={setCurrentUser}
          onGroupCreated={handleGroupCreated}
          unreadCounts={unreadCounts}
           onLeaveGroup={handleLeaveGroup}
        />
      </div>

      {/* Chat Area */}
      <div
        className={`
          ${showChat ? "flex" : "hidden md:flex"}
          flex-1
          flex-col
          min-w-0
        `}
      >
        {!selectedUser && !selectedGroup ? (
          <div className="flex-1 flex items-center justify-center bg-slate-200 dark:bg-gray-700">
            <div className="text-center">
              <div className="text-7xl mb-4">💬</div>

              <h1 className="text-3xl font-bold text-slate-700 dark:text-slate-100">
                Welcome to ChatApp
              </h1>

              <p className="text-slate-500 mt-2 dark:text-slate-200">
                Select a user or group to start chatting
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-slate-200">
              <div className="flex items-center">
                {/* Mobile Back Button */}


                <div className="flex-1">
                  <ChatHeader
                    selectedUser={selectedUser}
                    selectedGroup={selectedGroup}
                    onlineUsers={onlineUsers}
                    typing={typing}
                    groupTyping={groupTyping}
                    handleBack={handleBack}
                  />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              <MessageList
                messages={currentConversation}
                currentUserId={currentuser._id}
                setReplyMessage={setReplyMessage}
                handleEditMessage={editMessage}
                handleDeleteMessage={deleteMessage}
                reactToMessage={reactToMessage}

              />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-slate-200">
              <MessageInput
                input={input}
                setInput={setInput}
                sendMessage={sendMessage}
                replyMessage={replyMessage}
                setReplyMessage={setReplyMessage}

                socket={socket}
                currentUser={currentuser}
                selectedUser={selectedUser}
                selectedGroup={selectedGroup}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatApp;