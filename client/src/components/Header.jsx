import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [authStatus, setAuthStatus] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const status = localStorage.getItem("auth");

    setAuthStatus(status === "true"); // convert into boolean
  }, []);

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

      localStorage.removeItem("auth");
      setAuthStatus(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="px-20 py-4">
      <nav className="flex justify-between text-white font-serif">
        <div>
          <Link to="/">
            <span className="font-bold ml-32 text-2xl italic bg-gradient-to-r from-purple-400 to-red-500 bg-clip-text text-transparent cursor-pointer">
              Todos
            </span>
          </Link>
        </div>

        {/* <div>
          <ul>
            <li>Home</li>
          </ul>
        </div> */}

        <div>
          {authStatus ? (
            <button
              onClick={logout}
              className="bg-white/85 mr-24 px-3 py-1 rounded-md shaow-md text-black hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button className="bg-white/85 mr-24 px-3 py-1 rounded-md shaow-md text-black hover:scale-105 transition-all duration-300 cursor-pointer">
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Header;
