import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import http from "http";
import { socket } from "./sockets/socket.js";

dotenv.config({
  path: "./.env",
});

const app = express();

// config helmet
app.use(
  helmet({
    xPoweredBy: false, // hide Express information
  })
);
app.disable("x-powered-by");

const swaggerFile = JSON.parse(
  fs.readFileSync(new URL("../swagger-output.json", import.meta.url))
);

// config cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// express config
app.use(express.json());
app.use(cookieParser());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// import routes
import { userRouter } from "./routes/user.routes.js";
import { productRoute } from "./routes/product.routes.js";
import { orderRouter } from "./routes/order.routes.js";
import { searchLogRouter } from "./routes/searchLog.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/searches", searchLogRouter);

// error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// socket config
const server = http.createServer(app);
socket(server);

export { app, server };
