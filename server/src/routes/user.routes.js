import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
  updateAccountDetails,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const userRouter = Router();

userRouter
  .route("/register")
  .post(upload.fields([{ name: "coverImage", maxCount: 1 }]), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/current-user").get(verifyJWT, getCurrentUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter
  .route("/update-account")
  .patch(
    verifyJWT,
    upload.fields([{ name: "coverImage", maxCount: 1 }]),
    updateAccountDetails
  );
userRouter.route("/fogot-password").post(forgotPassword);
userRouter.route("/reset-password/:token").post(resetPassword);

export { userRouter };
