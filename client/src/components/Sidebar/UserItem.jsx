const UserItem = ({
  user,
  isOnline,
  selected,
  onClick,
  unreadCounts,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3
        p-3 rounded-xl cursor-pointer
        transition-all duration-200
        ${
          selected
            ? "bg-blue-100 border border-blue-300 dark:bg-blue-950"
            : "hover:bg-slate-100 dark:hover:bg-slate-700"
        }
      `}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        {user?.profileImage ? (
        <img
          src={user.profileImage}
          alt=""
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
      )}

        <div
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 ${
            isOnline
              ? "bg-green-500"
              : "bg-gray-400"
          }`}
        />
      </div>

      {/* User Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
  <h3 className="font-semibold text-slate-800 dark:text-white truncate">
    {user.username}
  </h3>

  {unreadCounts[user._id] > 0 && (
    <div className="bg-green-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
      {unreadCounts[user._id] > 99
  ? "99+"
  : unreadCounts[user._id]}
    </div>
  )}
</div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
};

export default UserItem;