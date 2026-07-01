import { useState } from "react";
import { createGroup } from "../services/groupService";

const CreateGroup = ({
  users,
  newGroupName,
  onGroupCreated,
  setNewGroupName,
  newGroupMembers,
  toggleMember,
  setShowCreateGroup,
  setNewGroupMembers,
}) =>
  {
    const [groupImage, setGroupImage] = useState(null);
const [preview, setPreview] = useState("");
 const handlecreateGroup = async () => {
  if (!newGroupName || newGroupMembers.length === 0) {
    return;
  }

  try {
    const formData = new FormData();

    formData.append("groupName", newGroupName);

    newGroupMembers.forEach((member) => {
      formData.append("members", member);
    });

    if (groupImage) {
      formData.append("groupImage", groupImage);
    }

    const data = await createGroup(formData);

    onGroupCreated(data);

    setShowCreateGroup(false);
    setNewGroupName("");
    setNewGroupMembers([]);
    setGroupImage(null);
    setPreview("");
  } catch (err) {
    console.error(err);
  }
};
  return (
    <div className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200 dark:bg-slate-700">
      <h3 className="font-semibold text-slate-700 mb-3 dark:text-slate-100">
        Create New Group
      </h3>
       <div className="flex flex-col items-center mb-4">
  {preview ? (
    <img
      src={preview}
      alt="Group"
      className="w-24 h-24 rounded-full object-cover border"
    />
  ) : (
    <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold">
      {newGroupName
        ? newGroupName.charAt(0).toUpperCase()
        : "G"}
    </div>
  )}

  <input
    type="file"
    accept="image/*"
    className="mt-3 w-full border rounded-lg p-2"
    onChange={(e) => {
      const file = e.target.files[0];

      if (!file) return;

      setGroupImage(file);
      setPreview(URL.createObjectURL(file));
    }}
  />
</div>
      <input
        value={newGroupName}
        onChange={(e) =>
          setNewGroupName(e.target.value)
        }
        placeholder="Enter group name..."
        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-slate-100"
      />

      <div className="mt-3">
        <p className="text-sm font-medium text-slate-600 mb-2 dark:text-slate-100">
          Select Members
        </p>

        <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
          {users.map((u) => (
            <label
              key={u._id}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
                newGroupMembers.includes(u._id)
                  ? "bg-blue-100 border border-blue-300 dark:bg-blue-800"
                  : "hover:bg-slate-100 hover:dark:bg-slate-500"
              }`}
            >
              <input
                type="checkbox"
                checked={newGroupMembers.includes(
                  u._id
                )}
                onChange={() =>
                  toggleMember(u._id)
                }
                className="w-4 h-4"
              />

              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                {u.username
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <span className="text-sm font-medium text-slate-700 dark:text-slate-100">
                {u.username.toUpperCase()}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handlecreateGroup}
          className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create Group
        </button>

        <button
          onClick={() => {
            setShowCreateGroup(false);
            setNewGroupMembers([]);
            setNewGroupName("");
          }}
          className="px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-100 transition dark:text-slate-100 hover:dark:bg-slate-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateGroup;