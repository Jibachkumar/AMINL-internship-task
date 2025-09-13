import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout as authLogout } from "../store/authSlice.js";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function LogoutBtn() {
  const API_URL = import.meta.env.VITE_API_URL;

  const { userData } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [avatarView, setAvatarView] = useState(false);

  const logout = async () => {
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/v1/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      dispatch(authLogout());
      navigate("/");
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };

  return (
    <div
      className="relative z-50"
      onMouseEnter={() => {
        setTimeout(() => {
          setAvatarView(true);
        }, 500);
      }}
      onMouseLeave={() => {
        setTimeout(() => {
          setAvatarView(false);
        }, 500);
      }}
    >
      <button className="bg-white/85 mr-16 px-3 py-1 rounded-full shaow-md text-black hover:scale-105 transition-all duration-300 cursor-pointer">
        {userData?.userName?.charAt(0).toUpperCase()}
      </button>

      {avatarView && (
        <div className="bg-white/90 absolute right-0 p-10 w-[20rem] rounded-md">
          <div className="mb-2">
            <button className="mr-5 px-3 py-1 rounded-full border border-black shaow-md text-black hover:scale-105 transition-all duration-300 cursor-pointer">
              {userData?.userName?.charAt(0).toUpperCase()}
            </button>
            <label htmlFor="" className="text-black">
              {userData.userName}
            </label>
          </div>
          <div className="flex gap-x-14">
            <Link to="/profile">
              <button
                onClick={() => setAvatarView(false)}
                className="bg-black/85 text-white px-3 py-1 rounded-md shaow-md hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                View Profile
              </button>
            </Link>
            <button
              onClick={logout}
              className="bg-black/85 px-3 py-1 rounded-md shaow-md text-white hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LogoutBtn;
