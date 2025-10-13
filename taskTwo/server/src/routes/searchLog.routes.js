import { Router } from "express";
import {
  exportTopSearchedProducts,
  getTopSearchedProducts,
} from "../controllers/searchLog.controllers.js";

const searchLogRouter = Router();

searchLogRouter.route("/top-search-product").get(getTopSearchedProducts);
searchLogRouter.route("/top-search/export").get(exportTopSearchedProducts);

export { searchLogRouter };
