import logger from "../utils/logger.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.models.js";
import { Order } from "../models/order.models.js";
import { Op } from "sequelize";
import { sequelize } from "../db/index.js";
import { generateExcel } from "../utils/generateExcel.js";

const createOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity) throw new ApiError(400, "Quantity is required");

    const user = await User.findOne({ where: { id: req.user?.id } });
    if (!user) {
      logger.warn("user is not authenticated");
      throw new ApiError(401, "Unauthorized User");
    }

    const product = await Product.findByPk(id);
    if (!product) {
      logger.warn("product id did not matched");
      throw new ApiError(404, "Product not found");
    }

    const order = await Order.create({
      userId: user.id,
      productId: id,
      quantity,
    });

    const createdOrder = await Order.findByPk(order.id);
    if (!createdOrder) {
      logger.warn("something went wrong while creating order");
      throw new ApiError(500, "somethinf went wrong while creating order");
    }

    logger.info("Order placed successfully");

    return res
      .status(201)
      .json({ data: createdOrder, message: "order placed successfully" });
  } catch (error) {
    logger.error(`Error in Order product: ${error.message}`);
    next(error);
  }
};

const getOrderDetails = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate dates
    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Please provide both startDate and endDate in the query.",
      });
    }

    const orders = await Order.findAll({
      where: {
        createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] },
      },
      include: [
        { model: Product, as: "product" },
        { model: User, as: "user" },
      ],
    });

    if (!orders.length) {
      logger.warn("No orders found for the given date range");
      throw new ApiError(404, "No orders found for the given date range");
    }

    // total sales
    const totalSales = orders.reduce((sum, order) => sum + order.quantity, 0);

    // total revenue
    const totalRevenue = orders.reduce((sum, order) => {
      const price = order.product.price;
      return sum + price * order.quantity;
    }, 0);

    // average order value
    const averageOrderValue = totalRevenue / totalSales;

    return res.status(200).json({
      data: {
        totalSales,
        totalRevenue,
        averageOrderValue,
        orders,
      },
      message: "created order fetched successfully",
    });
  } catch (error) {
    logger.error(`Error in get Order details: ${error.message}`);
    next(error);
  }
};

const getSalesStatus = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      logger.warn("startDate and endDate required");
      throw new ApiError(400, "startDate and endDate required");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in milliseconds
    const diffMs = end - start;
    console.log(diffMs);

    // 365 days in milliseconds (approximate, ignoring leap years)
    const maxMs = 365 * 24 * 60 * 60 * 1000;
    console.log(maxMs);

    if (diffMs > maxMs) {
      logger.warn("Date range cannot exceed one year.");
      throw new ApiError(400, "Date range cannot exceed one year");
    }

    const orders = await Order.findAll({
      where: { createdAt: { [Op.between]: [start, end] } },
      include: [{ model: Product, as: "product" }],
    });

    // Group by date
    const dailyStats = {};
    orders.forEach((order) => {
      const date = order.createdAt.toLocaleDateString("en-CA"); // YYYY-MM-DD
      const revenue = order.product.price * order.quantity;

      if (!dailyStats[date]) {
        dailyStats[date] = { date, totalSales: 0, totalRevenue: 0 };
      }
      dailyStats[date].totalSales += order.quantity;
      dailyStats[date].totalRevenue += revenue;
    });

    console.log(dailyStats);

    const data = Object.values(dailyStats).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // total sales
    const totalSales = orders.reduce(
      (sum, order) => sum + order.product.price * order.quantity,
      0
    );

    res.status(200).json({ data, totalSales });
  } catch (error) {
    logger.error(`Error in get sales status: ${error.message}`);
    next(error);
  }
};

const getTopSellingProducts = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      logger.warn("startDate and endDate required");
      throw new ApiError(400, "startDate and endDate required");
    }

    const topProduct = await Order.findAll({
      where: {
        createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] },
      },
      attributes: [
        "productId",
        [sequelize.fn("SUM", sequelize.col("quantity")), "totalQuantity"],
        [
          sequelize.literal(`SUM("quantity" * "product"."price")`),
          "totalRevenue",
        ],
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["name", "price"],
        },
      ],
      group: ["productId", "product.id"],
      order: [[sequelize.fn("SUM", sequelize.col("quantity")), "DESC"]],
      limit: 10,
    });

    return res.status(200).json({
      data: topProduct,
      message: "top 10 order product fetched successfully",
    });
  } catch (error) {
    logger.error(`Error in getTopSellingProducts: ${error.message}`);
    next(error);
  }
};

const exportOrderDetails = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const orders = await Order.findAll({
      where: {
        createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] },
      },
      include: [{ model: Product, as: "product" }],
    });

    const data = orders.map((order) => ({
      Date: order.createdAt.toISOString().split("T")[0],
      Product: order.product?.name,
      Quantity: order.quantity,
      Total: order.product?.price * order.quantity,
    }));

    const columns = [
      { header: "Date", key: "Date", width: 15 },
      { header: "Product", key: "Product", width: 20 },
      { header: "Quantity", key: "Quantity", width: 10 },
      { header: "Total", key: "Total", width: 10 },
    ];

    const xlsBuffer = await generateExcel(
      columns,
      data,
      "Orders Products Details report"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=top_selling_${startDate}_${endDate}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    return res.send(xlsBuffer);
  } catch (error) {
    next(error);
  }
};

const exportDailySellingProducts = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const orders = await Order.findAll({
      where: { createdAt: { [Op.between]: [start, end] } },
      include: [{ model: Product, as: "product" }],
    });

    // Group by date
    const dailyStats = {};
    orders.forEach((order) => {
      const date = order.createdAt.toLocaleDateString("en-CA"); // YYYY-MM-DD
      const revenue = order.product.price * order.quantity;

      if (!dailyStats[date]) {
        dailyStats[date] = { date, totalSales: 0, totalRevenue: 0 };
      }
      dailyStats[date].totalSales += order.quantity;
      dailyStats[date].totalRevenue += revenue;
    });

    const data = Object.values(dailyStats).map((item) => ({
      Date: item.date,
      TotalSales: item.totalSales,
      TotalRevenue: item.totalRevenue,
    }));

    const columns = [
      { header: "Date", key: "Date", width: 20 },
      { header: "Total Sold", key: "TotalSales", width: 15 },
      { header: "Total Revenue", key: "TotalRevenue", width: 15 },
    ];
    const xlsBuffer = await generateExcel(
      columns,
      data,
      "Daily Selling Products"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=top_selling_${startDate}_${endDate}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    return res.send(xlsBuffer);
  } catch (error) {
    logger.error(`Error in get sales status: ${error.message}`);
    next(error);
  }
};

const exportTopSellingProducts = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const products = await Order.findAll({
      where: {
        createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] },
      },
      attributes: [
        "productId",
        [sequelize.fn("SUM", sequelize.col("quantity")), "totalQuantity"],
        [
          sequelize.literal(`SUM("quantity" * "product"."price")`),
          "totalRevenue",
        ],
      ],
      include: [{ model: Product, as: "product", attributes: ["name"] }],
      group: ["productId", "product.id"],
      order: [[sequelize.fn("SUM", sequelize.col("quantity")), "DESC"]],
      limit: 10,
    });

    const data = products.map((item) => ({
      Product: item.product.name,
      QuantitySold: item.dataValues.totalQuantity,
      TotalRevenue: item.dataValues.totalRevenue,
    }));

    const columns = [
      { header: "Product", key: "Product", width: 20 },
      { header: "Quantity Sold", key: "QuantitySold", width: 15 },
      { header: "Total Revenue", key: "TotalRevenue", width: 15 },
    ];
    const xlsBuffer = await generateExcel(
      columns,
      data,
      "Top Selling Products"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=top_selling_${startDate}_${endDate}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    return res.send(xlsBuffer);
  } catch (error) {
    logger.error(`Error in exportTopSellingProducts: ${error.message}`);
    next(error);
  }
};

export {
  createOrder,
  getOrderDetails,
  getSalesStatus,
  getTopSellingProducts,
  exportTopSellingProducts,
  exportDailySellingProducts,
  exportOrderDetails,
};
