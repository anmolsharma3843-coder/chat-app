import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({
  messages,
  currentUserId,
  setReplyMessage,
  handleEditMessage,
  handleDeleteMessage,
   reactToMessage
}) => {
    const messagesEndRef=useRef(null)
  useEffect(()=>{
    messagesEndRef.current?.scrollIntoView({behavior:'smooth'})
  },[messages])
  return (
   <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-slate-200 dark:bg-gray-700">
  {messages.length === 0 ? (
    <div className="h-full flex items-center justify-center">
      <p className="text-slate-500 dark:text-slate-300">No Messages Yet 👋</p>
    </div>
  ) : (
    messages.map((msg, index) => (
      <MessageBubble
        key={msg._id || index}
        msg={msg}
        currentUserId={currentUserId}
        setReplyMessage={setReplyMessage}
        onEdit={handleEditMessage}
        onDelete={handleDeleteMessage}
        reactToMessage={reactToMessage}
      />
    ))
  )}
  <div ref={messagesEndRef} />
</div>

  );
};

export default MessageList;