import { useEffect, useState, useMemo } from "react";
import { Send, MessageCircle } from "lucide-react";
import { io } from "socket.io-client";

export default function ChatSupport() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const [selectedUserId, setSelectedUserId] = useState(null);

  const socket = useMemo(
    () =>
      // create a brand-new socket connection every time the component re-renders or mounts.
      io(import.meta.env.VITE_API_URL, {
        auth: { token: user?.user.accessToken },
        autoConnect: false, // socket connection is created only once
      }),
    [user]
  );

  useEffect(() => {
    // Only connect socket once
    if (isOpen && !socket.connected) {
      socket.connect();
    }

    // ✅ Listen for messages from server
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, { ...data }]);
    });

    // Listen for updated user list (admin only)
    socket.on("user-list", ({ users }) => {
      setUsers(users);
      if (user.user.role === "admin" && users.length && !selectedUserId) {
        setSelectedUserId(users[0].id);
      }
    });

    socket.on("error-message", (err) => {
      console.error("❌ Socket error:", err);
    });

    return () => {
      socket.off("receive-message");
      socket.off("user-list");
      socket.off("error-message");
    };
  }, [isOpen, socket]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const payload = { text: input };

    // Admin must select a user
    if (user.user.loggedInUser.role === "admin") {
      if (!selectedUserId) return alert("Select a user to chat with");
      payload.receiverId = selectedUserId;
    }

    // send to server
    console.log(payload);
    socket.emit("private-message", payload);
    setInput("");
  };

  return (
    <div className="relative">
      {/* Chat Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-10 right-16 z-50 bg-fuchsia-700 text-white p-4 rounded-full shadow-lg hover:bg-fuchsia-800 transition"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 flex flex-col w-80 h-[500px] bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-fuchsia-700 to-pink-600 p-4 text-white flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Customers Support</h2>
              <p className="text-xs opacity-90">chat with admin</p>
              {user?.user?.loggedInUser?.role === "admin" && (
                <select
                  value={selectedUserId || ""}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="ml-2 text-sm rounded px-2 py-1"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.userName}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.time}
                className={`flex ${
                  msg.sender === user?.user?.loggedInUser.userName
                    ? "justify-end"
                    : msg.sender === "system"
                    ? "justify-center"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl shadow-sm ${
                    msg.sender === user?.user?.loggedInUser.userName
                      ? "bg-fuchsia-700 text-white rounded-br-none"
                      : msg.sender === "system"
                      ? "bg-gray-200 text-gray-600 italic"
                      : "bg-fuchsia-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.sender !== "system" && (
                    <div className="text-xs font-semibold opacity-70">
                      {msg.sender}
                    </div>
                  )}
                  <div>{msg.msg}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 flex items-center gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="Reply to Ncell Support"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
            <button
              onClick={sendMessage}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white p-2 rounded-full transition"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
