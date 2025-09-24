import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";
const validateSchema = (schema) => {
  return (req, _, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      logger.warn(`Validation failed ${error.message}`);
      return next(new ApiError(400, error.message));
    }
    next();
  };
};

export { validateSchema };
