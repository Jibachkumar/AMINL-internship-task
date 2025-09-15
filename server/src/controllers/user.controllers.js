import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import {
  uploadOnCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.js";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail.js";
import { url } from "inspector";

// helper function
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { userName, email, address, phoneNumber, password } = req.body;

    if (!userName || !email || !address || !phoneNumber || !password) {
      throw new ApiError(400, "all field are required");
    }
    // check user already exit
    const existedUser = await User.findOne({ email });

    if (existedUser) {
      throw new ApiError(409, "User with email is already exits");
    }

    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    console.log("coverImageLocalPath: ", coverImageLocalPath);

    if (!coverImageLocalPath) {
      throw new ApiError(400, "cover image file is required");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // create user
    const user = await User.create({
      userName: userName.toLowerCase(),
      email,
      address,
      phoneNumber,
      coverImage: {
        url: coverImage.url,
        public_id: coverImage.public_id,
      },
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    return res
      .status(201)
      .json({ createdUser, message: "User register Successfully " });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new ApiError(400, "email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "user not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Password is Incorrect");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    console.log("loggedInUser", loggedInUser);
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

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ user: {}, message: "User Logged Out Successfully" });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res) => {
  return res
    .status(200)
    .json({ user: req?.user, message: "user fetched successfully" });
};

const refreshAccessToken = async (req, res, next) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ accessToken, refreshToken, message: "Access token refreshed" });
  } catch (error) {
    next(error);
  }
};

const updateAccountDetails = async (req, res, next) => {
  const updatedProfile = {};
  try {
    const { userName, address, phoneNumber, email } = req.body;

    const localCoverImage = req.files?.coverImage?.[0]?.path;

    if (!userName && !address && !phoneNumber && !email && !localCoverImage) {
      throw new ApiError(400, "Sorry you did not provide any field to update");
    }

    if (userName) updatedProfile.userName = userName;
    if (address) updatedProfile.address = address;
    if (phoneNumber) updatedProfile.phoneNumber = phoneNumber;
    if (email) updatedProfile.email = email;

    if (localCoverImage) {
      const currentUser = await User.findById(req.user._id);

      await deleteImageFromCloudinary(currentUser.coverImage.public_id);

      const coverImage = await uploadOnCloudinary(localCoverImage);
      if (coverImage) {
        updatedProfile.coverImage = {
          url: coverImage.url,
          public_id: coverImage.public_id,
        };
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: updatedProfile,
      },
      { new: true }
    ).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json({ user, message: "Profile updated Successfully" });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
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

    res.status(200).json({ message: "Reset link sent to your mail" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, "Invalid or expired token");
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
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
