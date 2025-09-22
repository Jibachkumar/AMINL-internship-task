import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";
import logger from "./logger.js";

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
    if (!localFilePath) {
      logger.warn("No file path provided for Cloudinary upload");
      return null;
    }
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folder,
    });
    // file has been uploaded successfull
    logger.info("File uploaded to Cloudinary successfully");
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    logger.error("Cloudinary upload failed", { error: error.message });
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
