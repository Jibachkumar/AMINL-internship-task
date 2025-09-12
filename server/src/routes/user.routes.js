import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
} from "../controllers/user.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/current-user").get(verifyJWT, getCurrentUser);
userRouter.route("/refresh-token").post(refreshAccessToken);

export { userRouter };
