import { FaArrowLeft } from "react-icons/fa";
const ChatHeader = ({
  selectedUser,
  selectedGroup,
  onlineUsers,
  typing,
  groupTyping,
  handleBack
}) => {
  const name =
    selectedUser?.username ||
    selectedGroup?.groupName;

  const isOnline =
    selectedUser &&
    onlineUsers.includes(
      selectedUser._id
    );

  return (
    <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shadow-sm dark:bg-gray-700">
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="md:hidden"
        >
          <FaArrowLeft size={20} className="dark:text-white" />
        </button>
        {/* Avatar */}
        <div className="relative">
          <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg ">
            {name?.charAt(0).toUpperCase()}
          </div>

          {selectedUser && (
            <div
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full border-2 border-white ${isOnline
                  ? "bg-green-500"
                  : "bg-gray-400"
                }`}
            />
          )}
        </div>

        {/* Info */}
        <div>
          <h2 className="font-semibold text-slate-800 text-md sm:text-lg dark:text-slate-200">
            {name}
          </h2>

          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-300">
           {selectedGroup
  ? groupTyping
    ? `${groupTyping} is typing...`
    : "Group Chat"
  : typing
  ? "Typing..."
  : isOnline
  ? "Online"
  : `Last seen at ${new Date(
                    selectedUser.lastSeen
                  ).toLocaleString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="hidden sm:block p-2 rounded-lg hover:bg-slate-400 transition">
          📞
        </button>

        <button className="hidden sm:block p-2 rounded-lg hover:bg-slate-400 transition">
          🎥
        </button>

        <button className="p-2 rounded-lg hover:bg-slate-400 transition dark:text-slate-100">
          ⋮
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;