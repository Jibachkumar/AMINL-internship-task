import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import {
  uploadOnCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.js";
import crypto from "crypto";
import logger from "../utils/logger.js";

// helper function
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    logger.info("Access and refresh tokens generated");

    return { accessToken, refreshToken };
  } catch (error) {
    logger.error("Error in generating access and refresh tokens", {
      error: error.message,
    });
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { userName, email, address, phoneNumber, password } = req.body;

    // check user already exit
    const existedUser = await User.findOne({ where: { email } });

    if (existedUser) {
      logger.warn("User with email already exists");
      throw new ApiError(409, "User with email is already exits");
    }

    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!coverImageLocalPath) {
      logger.warn("User registration missing cover image");
      throw new ApiError(400, "cover image file is required");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // create user
    const user = await User.create({
      userName: userName.toLowerCase(),
      email: email.toLowerCase(),
      address,
      phoneNumber,
      coverImage: {
        url: coverImage.url,
        public_id: coverImage.public_id,
      },
      password,
    });

    const createdUser = await User.findOne({
      where: { id: user.id },
      attributes: { exclude: ["password", "refreshToken"] },
    });
    logger.info("User registered successfully");

    if (!createdUser) {
      logger.warn("user registering failed");
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    return res
      .status(201)
      .json({ createdUser, message: "User register Successfully " });
  } catch (error) {
    logger.error(`Error in registerUser controller ${error.message}`);
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      logger.warn("Login failed: user not found");
      throw new ApiError(404, "user not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      logger.warn("Login failed: incorrect password");
      throw new ApiError(401, "Password is Incorrect");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user.id
    );

    const loggedInUser = await User.findByPk(user.id, {
      attributes: { exclude: ["password", "refreshToken"] },
    });

    logger.info("User logged in successfully");
    // return response
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        user: { loggedInUser, accessToken, refreshToken },
        message: "User logged In Successfully",
      });
  } catch (error) {
    logger.error(`Error in loginUser controller: ${error.message}`);
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user?._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      { new: true }
    );

    logger.info("User logged out successfully");

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ user: {}, message: "User Logged Out Successfully" });
  } catch (error) {
    logger.error("Error in logoutUser controller", { error: error.message });
    next(error);
  }
};

const getCurrentUser = async (req, res) => {
  logger.info("user fetched successfully");
  return res
    .status(200)
    .json({ user: req?.user, message: "user fetched successfully" });
};

const refreshAccessToken = async (req, res, next) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
      logger.warn("Refresh token missing in request");
      throw new ApiError(401, "unauthorized request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      logger.warn("User not found for provided refresh token");
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      logger.warn("Refresh token is expired or already used");
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    logger.info("Access token refreshed successfully");

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ accessToken, refreshToken, message: "Access token refreshed" });
  } catch (error) {
    logger.error("Error in refreshAccessToken controller", {
      error: error.message,
    });
    next(error);
  }
};

const updateAccountDetails = async (req, res, next) => {
  const updatedProfile = {};
  try {
    const { userName, address, phoneNumber, email } = req.body;

    const localCoverImage = req.files?.coverImage?.[0]?.path;

    if (userName) updatedProfile.userName = userName;
    if (address) updatedProfile.address = address;
    if (phoneNumber) updatedProfile.phoneNumber = phoneNumber;
    if (email) updatedProfile.email = email;

    if (localCoverImage) {
      const currentUser = await User.findById(req.user._id);

      if (currentUser?.coverImage?.public_id) {
        await deleteImageFromCloudinary(currentUser.coverImage.public_id);
        logger.info("Deleted old cover image from Cloudinary");
      }

      const coverImage = await uploadOnCloudinary(localCoverImage);
      if (coverImage) {
        updatedProfile.coverImage = {
          url: coverImage.url,
          public_id: coverImage.public_id,
        };
      }
    }

    // Throw error only if nothing is provided
    if (Object.keys(updatedProfile).length === 0) {
      logger.warn("Update attempt with no fields provided");
      throw new ApiError(
        400,
        "At least one field must be provided to update the account"
      );
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: updatedProfile,
      },
      { new: true }
    ).select("-password -refreshToken");

    if (!user) {
      logger.warn("User not found for update");
      throw new ApiError(404, "User not found");
    }

    logger.info("User profile updated successfully");

    return res
      .status(200)
      .json({ user, message: "Profile updated Successfully" });
  } catch (error) {
    logger.error("Error in updateAccountDetails controller", {
      error: error.message,
    });
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      logger.warn("Forgot password request with missing email");
      throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("Forgot password attempted for non-existent user");
      throw new ApiError(404, "User not found");
    }

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    /// save token and expiry in DB
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    logger.info("Password reset token generated and saved");

    const resetUrl = `${process.env.CORS_ORIGIN}/reset-password/${resetToken}`;
    const message = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Click below link:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `;

    await sendMail({
      to: user.email,
      subject: "Password reset",
      html: message,
    });

    logger.info("Password reset email sent");

    return res.status(200).json({ message: "Reset link sent to your mail" });
  } catch (error) {
    logger.error("Error in forgotPassword controller", {
      error: error.message,
    });
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      logger.warn("Reset password attempt with missing password");
      throw new ApiError(400, "Password is required");
    }

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      logger.warn("Invalid or expired password reset token");
      throw new ApiError(400, "Invalid or expired token");
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save({ validateBeforeSave: false });

    logger.info("Password reset successfully");

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    logger.error("Error in resetPassword controller", { error: error.message });
    next(error);
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
  updateAccountDetails,
  forgotPassword,
  resetPassword,
};
