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
    <div className="h-[100dvh] flex bg-slate-100 dark:bg-gray-900">
  {/* Sidebar */}
  <aside
    className={`
      ${showChat ? "hidden md:flex" : "flex"}
      w-full md:w-[320px] flex-shrink-0 bg-white dark:bg-gray-800
      border-r border-slate-200 dark:border-gray-700
      transition-all duration-300
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
  </aside>

  {/* Chat Area */}
  <main
    className={`
      ${showChat ? "flex" : "hidden md:flex"}
      flex-1 flex-col min-w-0 h-full overflow-hidden
      transition-all duration-300
    `}
  >
    {!selectedUser && !selectedGroup ? (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-6xl mb-4">💬</div>
          <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-100">
            Welcome to ChatApp
          </h1>
          <p className="text-slate-500 mt-2 dark:text-slate-300">
            Select a user or group to start chatting
          </p>
        </div>
      </div>
    ) : (
      <>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-slate-200 dark:border-gray-700">
          <ChatHeader
            selectedUser={selectedUser}
            selectedGroup={selectedGroup}
            onlineUsers={onlineUsers}
            typing={typing}
            groupTyping={groupTyping}
            handleBack={handleBack}
          />
        </header>

        {/* Messages */}
        <section className="flex-1 overflow-y-auto scroll-smooth snap-y">
          <MessageList
            messages={currentConversation}
            currentUserId={currentuser._id}
            setReplyMessage={setReplyMessage}
            handleEditMessage={editMessage}
            handleDeleteMessage={deleteMessage}
            reactToMessage={reactToMessage}
          />
        </section>

        {/* Input */}
        <footer className="shrink-0 bg-white dark:bg-gray-800 border-t border-slate-200 dark:border-gray-700">
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
        </footer>
      </>
    )}
  </main>
</div>

  );
};

export default ChatApp;