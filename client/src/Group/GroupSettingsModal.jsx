import { useState } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { addMember, deleteGroup, removeMember, updateGroup, leaveGroup } from "../services/groupService";

const GroupSettingsModal = ({
  group,
  users,
  currentUser,
  onClose,
   onLeaveGroup,
  refreshGroups,
}) => {
  const [groupName, setGroupName] = useState( group.groupName );
  console.log(group)
  const [selectedMember, setSelectedMember] = useState("");
const [groupImage, setGroupImage] = useState(null);
const isAdmin = group.admin === currentUser._id || group.admin?._id === currentUser._id;
const [preview, setPreview] = useState(
  group.groupImage
    ? `${import.meta.env.VITE_BASE_URL}${group.groupImage}`
    : ""
);

  // Local state for instant UI updates
  const [members, setMembers] = useState( group.members || [] );

  // Rename Group
const handleRename = async () => {
  try {
    const formData = new FormData();

    formData.append("groupName", groupName);

    if (groupImage) {
      formData.append("groupImage", groupImage);
    }

    await updateGroup(group._id, formData);

    refreshGroups?.();

    alert("Group updated successfully");
  } catch (error) {
    alert(error.message);
  }
};

  // Add Member
  const handleAddMember = async () => {
    if (!selectedMember) return;

    try {
      const data=await addMember(group._id, selectedMember)

      const addedUser = users.find(
        (u) => u._id === selectedMember
      );

      if (addedUser) {
        setMembers((prev) => [
          ...prev,
          addedUser,
        ]);
      }

      setSelectedMember("");

      refreshGroups?.();
    } catch (error) {
      alert(error.message);
    }
  };

  // Remove Member
  const handleRemoveMember = async (
    memberId
  ) => {
    try {
      await removeMember(group._id, memberId);

      setMembers((prev) =>
        prev.filter(
          (m) => m._id !== memberId
        )
      );

      refreshGroups?.();
    } catch (error) {
      alert(error.message);
    }
  };

  // Delete Group
  const handleDeleteGroup = async () => {
    if (
      !window.confirm(
        "Delete this group?"
      )
    )
      return;

    try {
      const data = await deleteGroup(group._id)

      refreshGroups?.();

      onClose();
    } catch (error) {
      alert(error.message);
    }
  };
  const handleLeaveGroup = async () => {
  const ok = window.confirm(
    "Are you sure you want to leave this group?"
  );

  if (!ok) return;

  try {
    await leaveGroup(group._id);
    onLeaveGroup(group._id);
    refreshGroups?.();

    onClose();
  } catch (error) {
    alert(error.message);
  }
};
if (!isAdmin) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 w-[380px] rounded-2xl p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold dark:text-white">
            Group Info
          </h2>

          <button onClick={onClose}>
            <RxCross2
              size={24}
              className="text-gray-500 hover:text-red-500"
            />
          </button>
        </div>

        <div className="flex flex-col items-center">
          {preview ? (
            <img
              src={preview}
              alt=""
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-3xl text-white font-bold">
              {group.groupName.charAt(0).toUpperCase()}
            </div>
          )}

          <h3 className="mt-4 text-xl font-semibold dark:text-white">
            {group.groupName}
          </h3>

          <p className="text-gray-500 text-sm mt-1">
            {members.length} Members
          </p>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold mb-3 dark:text-white">
            Members
          </h4>

          <div className="max-h-56 overflow-y-auto space-y-2">
            {members.map((member) => (
              <div
                key={member._id}
                className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                {member.profileImage ? (
                  <img
                    src={`http://localhost:4600${member.profileImage}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="font-medium dark:text-white">
                  {member.username}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleLeaveGroup}
          className="w-full mt-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold"
        >
          Leave Group
        </button>
      </div>
    </div>
  );
}else{
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-5 rounded-xl w-[450px] max-h-[80vh] overflow-y-auto"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Group Settings
          </h2>

          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-red-500"
          >
            <RxCross2 size={24} />
          </button>
        </div>
       <div className="flex flex-col items-center gap-3 mb-5">
  {preview ? (
    <img
      src={preview}
      alt="Group"
      className="w-24 h-24 rounded-full object-cover border"
    />
  ) : (
    <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl">
      {groupName.charAt(0).toUpperCase()}
    </div>
  )}

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];

      if (!file) return;

      setGroupImage(file);
      setPreview(URL.createObjectURL(file));
    }}
    className="w-full border rounded-lg p-2"
  />
</div>

        {/* Rename */}
        <div className="mb-5">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Rename Group
          </h3>

          <div className="flex gap-2">
            <input
              value={groupName}
              onChange={(e) =>
                setGroupName(
                  e.target.value
                )
              }
              className="flex-1 border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />

            <button
              onClick={handleRename}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded"
            >
              Save
            </button>
          </div>
        </div>

        {/* Add Member */}
        <div className="mb-5">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Add Member
          </h3>

          <select
            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={selectedMember}
            onChange={(e) =>
              setSelectedMember(
                e.target.value
              )
            }
          >
            <option value="">
              Select User
            </option>

            {users
              ?.filter(
                (u) =>
                  !members.some(
                    (m) =>
                      m._id === u._id
                  )
              )
              .map((u) => (
                <option
                  key={u._id}
                  value={u._id}
                >
                  {u.username}
                </option>
              ))}
          </select>

          <button
            onClick={handleAddMember}
            className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded"
          >
            Add Member
          </button>
        </div>

        {/* Members */}
        <div className="mb-5">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Members ({members.length})
          </h3>

          {members.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No members
            </p>
          ) : (
            members.map((member) => (
              <div
                key={member._id}
                className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 py-2"
              >
                <span className="text-gray-900 dark:text-gray-100">
                  {member.username}
                </span>

                <button
                  onClick={() =>
                    handleRemoveMember(
                      member._id
                    )
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  <MdOutlineDeleteOutline
                    size={20}
                  />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Delete Group */}
        <button
          onClick={handleDeleteGroup}
          className="w-full p-2 bg-red-600 hover:bg-red-700 text-white rounded mb-2"
        >
          Delete Group
        </button>

        <button
          onClick={onClose}
          className="w-full p-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
};

export default GroupSettingsModal;