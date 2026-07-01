import { useTypingEmitter } from "../../hooks/useTypingEmitter";

const MessageInput = ({
  input,
  setInput,
  sendMessage,
  replyMessage,
  setReplyMessage,

  socket,
  currentUser,
  selectedUser,
  selectedGroup,
}) => {

  useTypingEmitter(
    socket,
    input,
    currentUser._id,
    currentUser.username,
    selectedUser,
    selectedGroup
  );

  return (
    <div className="bg-white border-t border-slate-200 p-4 dark:bg-gray-700">

      {replyMessage && (
        <div className="mb-3 bg-slate-100 dark:bg-slate-800 border-l-4 border-blue-500 rounded-lg p-3 flex items-start justify-between">
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-blue-600">
              Replying to
            </p>

            <p className="text-sm text-slate-700 dark:text-slate-200 truncate">
              {replyMessage.text}
            </p>
          </div>

          <button
            onClick={() =>
              setReplyMessage(null)
            }
            className="ml-3 text-slate-500 hover:text-red-500 text-lg"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) => {
  if (e.key === "Enter") {
    sendMessage(input, setInput);
  }
}}
          placeholder={
            replyMessage
              ? "Write a reply..."
              : "Type a message..."
          }
          className="flex-1 px-5 py-3 rounded-full bg-slate-100 dark:bg-slate-200 outline-none focus:ring-2 focus:bg-slate-100 focus:ring-blue-500 text-sm"
        />

        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default MessageInput;