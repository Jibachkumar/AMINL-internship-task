import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };
  return (
    <div className="px-20 py-4">
      <nav className="flex justify-between text-white font-serif">
        <div>
          <Link to="/">
            <span className="font-bold ml-32 text-2xl italic bg-gradient-to-r from-purple-400 to-red-500 bg-clip-text text-transparent cursor-pointer">
              E-commerce
            </span>
          </Link>
        </div>

        <div>
          <Link to="/report">
            <button className="bg-white/85 mr-90 px-3 py-1 rounded-md shaow-md text-black hover:scale-105 transition-all duration-300 cursor-pointer">
              Report
            </button>
          </Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-white/85 mr-36 px-3 py-1 rounded-md shaow-md text-black hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button className="bg-white/85 mr-36 px-3 py-1 rounded-md shaow-md text-black hover:scale-105 transition-all duration-300 cursor-pointer">
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
