import { Server } from "socket.io";

const socket = (server) => {
  const io = new Server(server);

  io.use({
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("socket is connected", socket);

    // Handle new messages
    socket.on("chat-message", (msg) => {
      console.log("Message received: ", msg);

      io.emit("chat message: ", msg);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("socket is disconnected");
    });
  });

  return io;
};

export { socket };
