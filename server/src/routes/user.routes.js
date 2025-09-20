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
  googleLogin,
} from "../controllers/user.controllers.js";
import {
  loginSchema,
  registerSchema,
  updateAccountSchema,
} from "../validators/user.validators.js";
import { validateSchema } from "../middlewares/schemaValidator.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import passport from "../utils/password.js";

const userRouter = Router();

userRouter
  .route("/register")
  .post(
    upload.fields([{ name: "coverImage", maxCount: 1 }]),
    validateSchema(registerSchema),
    registerUser
  );
userRouter.route("/login").post(validateSchema(loginSchema), loginUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/current-user").get(verifyJWT, getCurrentUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter
  .route("/update-account")
  .patch(
    verifyJWT,
    upload.fields([{ name: "coverImage", maxCount: 1 }]),
    validateSchema(updateAccountSchema),
    updateAccountDetails
  );
userRouter.route("/fogot-password").post(forgotPassword);
userRouter.route("/reset-password/:token").post(resetPassword);

// redirect user to google for login
userRouter
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

userRouter.route("/google/callback").get(
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleLogin
);

export { userRouter };
