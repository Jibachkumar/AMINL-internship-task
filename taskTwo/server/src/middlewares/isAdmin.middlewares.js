import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const isAdmin = async (req, _, next) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized request");
      throw new ApiError(401, "Unauthorized request");
    }

    if (req.user.role !== "admin") {
      logger.warn("Forbidden: Admins have access only");
      throw new ApiError(403, "Admins have access only");
    }
    next();
  } catch (error) {
    next(error);
  }
};

export { isAdmin };
