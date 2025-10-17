import dotenv from "dotenv";
import { Server } from "socket.io";
import logger from "../utils/logger.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

dotenv.config({
  path: "./.env",
});

const socket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
  });

  // Middleware for authentication
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      logger.warn("⚠️ Authentication error: Token missing");
      throw new ApiError(404, "Authentication error: Token missing");
    }

    // Verify token (example with JWT)
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findByPk(decoded.id, {
        attributes: ["id", "userName", "role"],
      });
      console.log(user);
      if (!user) throw new ApiError(404, "User not found");
      socket.user = user;
      next();
    } catch (error) {
      logger.error(" Invalid token");
      next(error);
    }
  });

  const users = new Map();

  io.on("connection", async (socket) => {
    logger.info("socket is connected");
    logger.info(
      ` ${socket.user.userName} connected (role: ${socket.user.role})`
    );

    // Admin joins all user rooms dynamically
    if (socket.user.role === "admin") {
      const allUsers = await User.findAll({ where: { role: "user" } });
      allUsers.forEach((u) => {
        const roomId = [u.id, socket.user.id].sort().join("_");
        socket.join(roomId);
      });
      socket.emit("user-list", { users: allUsers });
      logger.info(`🛠️ Admin joined all private rooms`);
    }

    // ✅ 1️⃣ Create or join private room automatically
    if (socket.user.role === "user") {
      const admin = await User.findOne({ where: { role: "admin" } });
      if (!admin) {
        logger.warn("⚠️ No admin found for chat");
        socket.emit("error-message", { message: "No admin available" });
        return;
      }

      const roomId = [socket.user.id, admin.id].sort().join("_");
      socket.join(roomId);
      socket.roomId = roomId;

      logger.info(`👤 ${socket.user.userName} joined private room ${roomId}`);
    }

    // ✅ handle private message
    socket.on("private-message", async (msg) => {
      let roomId;

      // User sending to admin
      if (socket.user.role === "user") {
        roomId = socket.roomId;
      }

      // Admin sending to a specific user
      if (socket.user.role === "admin") {
        if (!msg.receiverId) {
          return socket.emit("error-message", {
            message: "receiverId required for admin message",
          });
        }
        roomId = [socket.user.id, msg.receiverId].sort().join("_");
      }

      if (!roomId) {
        logger.warn("⚠️ No room found for user");
        socket.emit("error-message", { msg: "No room found" });
        return;
      }

      logger.info(`💬 ${socket.user.userName}: ${msg.text}`);

      io.to(roomId).emit("receive-message", {
        id: socket.user.id,
        senderId: socket.user.id,
        sender: socket.user.userName,
        role: socket.user.role,
        msg: msg.text,
        time: new Date(),
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      const username = users.get(socket.id);

      users.delete(socket.id);
      logger.info(`🔴 ${socket.user.userName} disconnected`);

      io.emit("user-list", {
        users: Array.from(users.values()),
        count: users.size,
      });

      // user left the chat
      io.emit("user-left", {
        text: `${username} left the chat.`,
        sender: "system",
      });
    });
  });

  return io;
};

export { socket };
