import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import ChatMessage from "./components/ChatMessage";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className=" w-full bg-slate-50 h-full">
        <div className="w-full">
          <Header />
        </div>
        <main className="w-full ">
          <Outlet />
        </main>
        <div className="relative">
          <ChatMessage />
        </div>
      </div>
    </>
  );
}

export default App;
