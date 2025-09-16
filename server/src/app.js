import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import passport from "./utils/password.js";

const swaggerFile = JSON.parse(
  fs.readFileSync(new URL("./swagger-output.json", import.meta.url))
);

dotenv.config({
  path: "./.env",
});

const app = express();

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

// config passport
app.use(passport.initialize());

// import routes
import { todoRouter } from "./routes/todo.routes.js";
import { userRouter } from "./routes/user.routes.js";

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// routes declaration
app.use("/api/v1/todos", todoRouter);
app.use("/api/v1/users", userRouter);

// error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export { app };
