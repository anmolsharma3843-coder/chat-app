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
    <div className="
bg-white
dark:bg-gray-800
border-t
border-slate-200
dark:border-gray-700
px-3
py-3
sm:px-5
">

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

    <div className="flex items-end gap-2">
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
          className="
flex-1
rounded-3xl
border
border-slate-300
bg-slate-100
dark:bg-gray-600
dark:text-white
px-5
py-3
outline-none
focus:border-blue-500
"
        />

        <button
          onClick={()=>sendMessage(input, setInput)}
          disabled={!input.trim()}
         className="
w-12
h-12
rounded-full
bg-blue-600
hover:bg-blue-700
active:scale-95
transition
text-white
flex
items-center
justify-center
disabled:opacity-50
"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default MessageInput;