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
    <div className="flex-1 overflow-y-scroll px-4 py-6 bg-slate-200 dark:bg-gray-700 h-full">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-slate-500 dark:text-slate-200">
            <h3 className="text-lg font-semibold">
              No Messages Yet
            </h3>
            <p className="text-sm mt-1">
              Start the conversation 👋
            </p>
          </div>
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
   reactToMessage={ reactToMessage}
/>
        ))
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;