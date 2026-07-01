import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

const MessageBubble = ({
  msg,
  currentUserId,
  setReplyMessage,
  onEdit,
  onDelete,
  reactToMessage
}) => {
  const mine =
    msg.sender?._id === currentUserId ||
    msg.sender === currentUserId;

  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(msg.text);
  const [showReactions, setShowReactions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const emojis = [
    "👍",
    "❤️",
    "😂",
    "😮",
    "😢",
    "🔥",
  ];

  const getStatusIcon = () => {
    switch (msg.status) {
      case "sent":
        return "✓";

      case "delivered":
        return "✓✓";

      case "read":
        return (
          <span className="text-cyan-300 font-extrabold">
            ✓✓
          </span>
        );

      default:
        return "";
    }
  };

  const saveEdit = () => {
    if (!editedText.trim()) return;

    onEdit(msg._id, editedText);
    setEditing(false);
  };

  return (
<div
  className={`flex mb-3 ${
    mine ? "justify-end" : "justify-start"
  }`}
>
  <div
    className={`group flex items-end gap-2 w-fit max-w-[85%] sm:max-w-[75%] md:max-w-[65%] ${
      mine ? "flex-row" : "flex-row-reverse"
    }`}
  >
    {/* Reaction Button */}
    <button
      onClick={() => setShowReactions(!showReactions)}
      className="
        w-8 h-8
        rounded-full
        bg-white
        shadow-md
        border
        flex
        items-center
        justify-center
        text-base
        hover:scale-110
        transition-all
        opacity-0
        group-hover:opacity-100
    "
    >
      😊
    </button>

    {/* Bubble */}
   <div
  className={`
    relative
    px-3 sm:px-4
    py-2.5 sm:py-3
    rounded-xl
    shadow-sm
    wrap-break-word
    break-all
    ${
      mine
        ? "bg-blue-600 text-white rounded-br-md"
        : "bg-white text-gray-800 rounded-bl-md dark:bg-slate-100"
    }
  `}
>
      {/* Reply Button */}
      <button
        onClick={() => setReplyMessage(msg)}
        className={`
          absolute
          top-0
          ${mine ? "left-0" : "right-2"}
          opacity-100 md:opacity-0 md:group-hover:opacity-100
          transition
          text-xs
          bg-black/20
          hover:bg-black/30
          text-white
          rounded-full
          w-4
          h-4
          flex
          items-center
          justify-center
        `}
      >
        ↩
      </button>

      {/* Edit/Delete */}
      {mine && !msg.deleted && (
  <div
    className={`absolute -top-0.5 ${
      mine ? "right-0" : "left-2"
    }`}
  >
    <button
      onClick={() => setShowMenu(!showMenu)}
      className="
        p-1
        rounded-full
        hover:bg-black/10
        text-white
        md:opacity-0
        md:group-hover:opacity-100
        opacity-100
        transition
      "
    >
      <BsThreeDotsVertical size={13} />
    </button>

    {showMenu && (
      <div
        className="
absolute
top-8
right-0
min-w-[120px]
bg-white
rounded-lg
shadow-xl
border
z-[999]
"
      >
        <button
          onClick={() => {
            setEditing(true);
            setShowMenu(false);
          }}
          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-700"
        >
          ✏️ Edit
        </button>

        <button
          onClick={() => {
            onDelete(msg._id);
            setShowMenu(false);
          }}
          className="w-full text-left px-3 py-2 hover:bg-red-100 text-red-600"
        >
          🗑 Delete
        </button>
      </div>
    )}
  </div>
)}

      {/* Emoji Picker */}
      {showReactions && (
        <div
          className={`
            absolute
            -top-12
            ${
              mine ? "right-0" : "left-0"
            }
            bg-white
            rounded-full
            shadow-xl
            border
            grid grid-cols-3 sm:flex gap-1
            max-w-[180px]
            px-2
            py-1
            z-50
          `}
        >
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                reactToMessage(msg._id, emoji);
                setShowReactions(false);
              }}
              className="text-xl hover:scale-125 transition"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Reply Preview */}
      {msg.replyTo && (
        <div
          className={`
            mb-3
            px-3
            py-2
            rounded-lg
            border-l-4
            ${
              mine
                ? "bg-blue-500/70 border-blue-200"
                : "bg-slate-200 border-blue-500"
            }
          `}
        >
          <p className="text-xs font-semibold">
            Replying to
          </p>

          <p className="text-sm truncate">
            {msg.replyTo.text}
          </p>
        </div>
      )}

      {/* Message */}
      {editing ? (
        <div className="space-y-2">
          <textarea
            rows={2}
            value={editedText}
            onChange={(e) =>
              setEditedText(e.target.value)
            }
            className="w-full rounded-lg border p-2 text-black resize-none text-sm"
          />

          <div className="flex justify-end gap-1 sm:gap-2">
            <button
              onClick={saveEdit}
              className="bg-green-500 text-white px-3 py-1 rounded-md text-sm"
            >
              Save
            </button>

            <button
              onClick={() => {
                setEditing(false);
                setEditedText(msg.text);
              }}
              className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p
            className={`text-[13px]
sm:text-sm
md:text-[15px] leading-relaxed whitespace-pre-wrap mt-2 ${
              msg.deleted
                ? "italic opacity-70"
                : ""
            }`}
          >
            {msg.text}
          </p>

          {msg.edited && !msg.deleted && (
            <p className="text-[10px] italic mt-1 opacity-80">
              edited
            </p>
          )}
        </>
      )}

      {/* Footer */}
      <div className="flex justify-end items-center gap-1 mt-2">
        <span className="text-[9px] sm:text-[10px] opacity-80">
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        {mine && (
          <span className="text-[11px]">
            {getStatusIcon()}
          </span>
        )}
      </div>

      {/* Reactions */}
      {msg.reactions?.length > 0 && (
       <div className="flex flex-wrap gap-1 mt-2 max-w-full">
          {Object.entries(
            msg.reactions.reduce((acc, reaction) => {
              acc[reaction.emoji] =
                (acc[reaction.emoji] || 0) + 1;
              return acc;
            }, {})
          ).map(([emoji, count]) => (
            <div
              key={emoji}
              className="px-2 py-1 rounded-full text-xs bg-black/10"
            >
              {emoji} {count}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>
  );
};

export default MessageBubble;