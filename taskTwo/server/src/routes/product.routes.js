import { Router } from "express";
import {
  createProduct,
  getProducts,
} from "../controllers/product.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { isAdmin } from "../middlewares/isAdmin.middlewares.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import { productModel } from "../validators/product.validators.js";
import { upload } from "../middlewares/multer.middlewares.js";

const productRoute = Router();

productRoute
  .route("/add-product")
  .post(
    verifyJWT,
    upload.fields([{ name: "productImage", maxCount: 1 }]),
    isAdmin,
    validateSchema(productModel),
    createProduct
  );

productRoute.route("/view-product").get(getProducts);

export { productRoute };
