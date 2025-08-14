import React, { useContext, useState } from "react";
import { Authcontext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { MdOutlineLogout } from "react-icons/md";

const ProfilePage = () => {
  const { authUser, updateProfile, logout } = useContext(Authcontext);
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser.fullName || "");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Get the current date
  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const day = currentDate.toLocaleString("default", { weekday: "long" });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImg(file);
    }
  };

  const handleProfileClick = () => {
    setShowModal(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (selectedImg) {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Image = reader.result;
          await updateProfile({
            profilePic: base64Image,
            fullName: name,
          });
          setShowModal(false);
          navigate("/");
        };
        reader.readAsDataURL(selectedImg);
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
        };
      } else {
        await updateProfile({
          fullName: name,
        });
        setShowModal(false);
        navigate("/");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setShowModal(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div>
          <h1 className="font-bold text-lg">Hi, {authUser.fullName}</h1>
          <p className="text-sm text-gray-600">
            {`${day}, ${month} ${currentDate.getDate()}, ${currentDate.getFullYear()}`}
          </p>
        </div>
        <div onClick={handleProfileClick} className="cursor-pointer">
          <img
            src={
              selectedImg
                ? URL.createObjectURL(selectedImg)
                : authUser.profilePic || assets.avatar_icon
            }
            alt="Profile"
            className="rounded-full h-10 w-10"
          />
        </div>
      </div>

      {/* Modal for updating profile */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-xl font-bold mb-4">Update Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
              <div className="flex mt-5">
                <MdOutlineLogout className="text-2xl mt-2" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-black text-white rounded w-[50%] mx-auto p-2"
                >
                  Logout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
