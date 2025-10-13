import { Router } from "express";
import {
  createOrder,
  getOrderDetails,
  getSalesStatus,
  getTopSellingProducts,
  exportTopSellingProducts,
  exportDailySellingProducts,
  exportOrderDetails,
} from "../controllers/order.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const orderRouter = Router();

orderRouter.route("/buy/:id").post(verifyJWT, createOrder);
orderRouter.route("/order-status").get(getOrderDetails);
orderRouter.route("/sales-status").get(getSalesStatus);
orderRouter.route("/top-order-product").get(getTopSellingProducts);
orderRouter.route("/order-product/export").get(exportOrderDetails);
orderRouter.route("/top-selling/export").get(exportTopSellingProducts);
orderRouter.route("/daily-selling/export").get(exportDailySellingProducts);

export { orderRouter };
