import React from "react";
import Header from "./Header.jsx";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="bg-[#172842]">
      <div>
        <Header />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
