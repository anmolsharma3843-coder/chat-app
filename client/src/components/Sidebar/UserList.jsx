import UserItem from "./UserItem";

const UserList = ({
  users,
  onlineUsers,
  selectedUser,
  handleSelectUser,
  unreadCounts
}) => {
  return (
    <div className="space-y-2 px-2 pb-4">
      {users.length === 0 ? (
        <div className="text-center py-8 text-slate-400 dark:text-gray-200">
          No users available
        </div>
      ) : (
        users.map((u) => (
          <UserItem
            key={u._id}
            user={u}
            isOnline={onlineUsers.includes(
              u._id
            )}
            selected={
              selectedUser?._id === u._id
            }
            onClick={() =>
              handleSelectUser(u)
            }
             unreadCounts={unreadCounts} 
          />
        ))
      )}
    </div>
  );
};

export default UserList;