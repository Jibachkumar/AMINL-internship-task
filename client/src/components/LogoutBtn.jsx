import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout as authLogout } from "../store/authSlice.js";

function LogoutBtn() {
  const API_URL = import.meta.env.VITE_API_URL;

  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const logout = async () => {
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/v1/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message);
      }

      dispatch(authLogout());
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };

  return (
    <button
      onClick={logout}
      className="bg-white/85 mr-24 px-3 py-1 rounded-md shaow-md text-black hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
