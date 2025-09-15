import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

dotenv.config({
  path: "./.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folder = "Todos") => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folder,
    });
    // file has been uploaded successfull
    console.log("file is uploaded on cloudinary ", response);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Cloudinary error:", error.message);
    fs.unlinkSync(localFilePath);
    throw new ApiError(error);
  }
};

const deleteImageFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new ApiError(error);
  }
};

export { uploadOnCloudinary, deleteImageFromCloudinary };
