const GroupList = ({
  groups,
  selectedGroup,
  handleSelectGroup,
  currentUserId,
  openGroupSettings,
}) => {
  return (
    <div className="space-y-2">
      {groups.map((g) => {
        const isAdmin =
          g.admin === currentUserId ||
          g.admin?._id === currentUserId;
        return (
          <div
            key={g._id}
            onClick={() =>
              handleSelectGroup(g)
            }
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
              ${selectedGroup?._id === g._id
                ? "bg-blue-100 border border-blue-300 dark:bg-blue-900"
                : "hover:bg-slate-100 hover:dark:bg-slate-500"
              }`}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              {g?.groupImage ? (
                <img
                  src={`http://localhost:4600${g.groupImage}`}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />) : (
                <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold">
                  {g.groupName?.charAt(0).toUpperCase()}
                </div>)}
            </div>

            {/* Group Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-slate-800 truncate dark:text-slate-100">
                {g.name || g.groupName}
              </h3>

              <p className="text-xs text-slate-500 dark:text-gray-200">
                Group Chat
              </p>
            </div>

            {/* Admin Badge */}
            {isAdmin && (
              <span className="text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                Admin
              </span>
            )}

            {/* Settings Button */}
          
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openGroupSettings(g);
                }}
                className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center"
              >
                ⚙️
              </button>
           
          </div>
        );
      })}

      {groups.length === 0 && (
        <div className="text-center py-4 text-sm text-slate-400 dark:text-gray-200">
          No Groups Found
        </div>
      )}
    </div>
  );
};

export default GroupList;