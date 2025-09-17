import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import passport from "./utils/password.js";
import helmet from "helmet";

const swaggerFile = JSON.parse(
  fs.readFileSync(new URL("./swagger-output.json", import.meta.url))
);

dotenv.config({
  path: "./.env",
});

const app = express();

// config helmet
app.use(
  helmet({
    xPoweredBy: false, // hide Express information
    contentSecurityPolicy: false, // disable strict CSP (resources allowed) (Google OAuth breaks otherwise)
    crossOriginEmbedderPolicy: false, // allow Google/3rd party embeds
  })
);

// Extra protections (safe with Google login)
app.use(helmet.frameguard({ action: "deny" })); // stops clickjacking attacks
app.use(helmet.noSniff()); // prevents MIME sniffing vulnerabilities.
app.use(helmet.referrerPolicy({ policy: "no-referrer" })); // hides sensitive info in Referer headers
// forces browsers to use HTTPS (expire in 2 years)
app.use(
  helmet.hsts({ maxAge: 63072000, includeSubDomains: true, preload: true })
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

// config passport
app.use(passport.initialize());

// import routes
import { userRouter } from "./routes/user.routes.js";
import { todoRouter } from "./routes/todo.routes.js";

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/todos", todoRouter);

// error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export { app };
