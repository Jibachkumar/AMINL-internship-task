import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutBtn from "./LogoutBtn.jsx";

function Header() {
  const { status } = useSelector((state) => state.auth);

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

        <div>
          {status ? (
            <LogoutBtn />
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
