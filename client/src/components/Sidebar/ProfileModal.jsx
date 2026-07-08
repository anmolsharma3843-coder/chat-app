import { useState } from "react";
import { CiDark } from "react-icons/ci";
import { CiLight } from "react-icons/ci";
const ProfileModal = ({
  user,
  onClose,
  onProfileUpdated,
}) => {
  const [username, setUsername] = useState(user.username);
const [image, setImage] = useState( null);
  const [darkMode, setDarkMode] = useState(false)
const [preview, setPreview] = useState(
  user.profileImage
    ? `${import.meta.env.VITE_BASE_URL}${user.profileImage}`
    : ""
);
console.log(user)
 const toggleTheme = () => {
    const next = !darkMode;

    setDarkMode(next);

    document.documentElement.classList.toggle("dark", next);

    localStorage.setItem("theme", next ? "dark" : "light");
  };
  const saveProfile = async () => {
    console.log("clicked")
    try {
      const formData= new FormData();
      
      formData.append('username', username)
      if (image) {
  formData.append("profileImage", image);
}
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/profile`,
        {
          method: "PATCH",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.success) {
        onProfileUpdated(data.user);
        onClose();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white dark:bg-gray-800 rounded-2xl w-[380px] p-6">

       
 <div className="flex justify-between items-center">
   <h2 className="text-xl font-bold mb-5 dark:text-white">
          Edit Profile
        </h2> <button
      onClick={toggleTheme}
      className="dark:text-white mb-5"
    >
      {darkMode ? <CiDark size={25}/> : <CiLight size={25}/>}
    </button></div>
        <div className="flex justify-center mb-5">

         {preview ? (
  <img
    src={preview}
    alt="Profile"
    className="w-24 h-24 rounded-full object-cover"
  />
) : (
  <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl">
    {username.charAt(0).toUpperCase()}
  </div>
)}

        </div>

        <input
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          className="w-full border rounded-lg p-3 mb-4 dark:text-slate-200"
          placeholder="Username"
        />

       <input
  type="file"
  accept="image/*"
  onChange={(e) => {
  const file = e.target.files[0];

  if (file) {
    setImage(file);                       // For uploading
    setPreview(URL.createObjectURL(file)); // For preview
  }
}}
          className="w-full border rounded-lg p-3 mb-4 dark:text-slate-200"
          placeholder="Profile Image URL"
        />

        <input
          value={user.email}
          readOnly
          className="w-full border rounded-lg p-3 bg-gray-100 mb-6 dark:bg-gray-300"
        />
 
        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={()=>saveProfile}
            className="px-5 py-2 rounded-lg bg-green-500 text-white"
          >
            Save
          </button>

        </div>

      </div>
    </div>
  );
};

export default ProfileModal;