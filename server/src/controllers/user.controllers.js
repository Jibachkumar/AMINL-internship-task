import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

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
    const { userName, email, password } = req.body;

    if ([userName, email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "all field are required");
    }
    // check user already exit
    const existedUser = await User.findOne({ email });

    if (existedUser) {
      throw new ApiError(409, "User with email is already exits");
    }

    // create user
    const user = await User.create({
      userName: userName.toLowerCase(),
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-passsword -refreshToken"
    );
    console.log("createdUser", createdUser);
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

    console.log(accessToken, refreshToken);

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
    .json({ user: req.user, message: "user fetched successfully" });
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

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
};
