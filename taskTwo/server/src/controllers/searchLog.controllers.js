import logger from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.models.js";
import { Op } from "sequelize";
import { sequelize } from "../db/index.js";
import { SearchLog } from "../models/searchLog.models.js";
import { generateExcel } from "../utils/generateExcel.js";

const getTopSearchedProducts = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      logger.warn("startDate and endDate required");
      throw new ApiError(400, "startDate and endDate required");
    }

    const topSearched = await SearchLog.findAll({
      where: {
        createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] },
      },
      attributes: [
        "productId",
        [sequelize.fn("COUNT", sequelize.col("productId")), "searchCount"],
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["name"],
        },
      ],
      group: ["productId", "product.id", "product.name"],
      order: [[sequelize.fn("COUNT", sequelize.col("productId")), "DESC"]],
      limit: 10,
    });

    if (!topSearched.length) {
      logger.warn("No search data found for the given date range");
      throw new ApiError(404, "No search data found for the given date range");
    }

    return res.status(200).json({
      data: topSearched,
      message: "top 10 product searched successfully",
    });
  } catch (error) {
    logger.error(`Error in getTopSearchedProducts: ${error.message}`);
    next(error);
  }
};

const exportTopSearchedProducts = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const topSearched = await SearchLog.findAll({
      where: {
        createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] },
      },
      attributes: [
        "productId",
        [sequelize.fn("COUNT", sequelize.col("productId")), "searchCount"],
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["name"],
        },
      ],
      group: ["productId", "product.id", "product.name"],
      order: [[sequelize.fn("COUNT", sequelize.col("productId")), "DESC"]],
      limit: 10,
    });

    const data = topSearched.map((item) => ({
      Product: item.product.name,
      searchCount: item.dataValues.searchCount,
    }));

    const columns = [
      { header: "Product", key: "Product", width: 20 },
      { header: "Searches", key: "searchCount", width: 15 },
    ];
    const xlsBuffer = await generateExcel(
      columns,
      data,
      "Top Searching Products"
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
    logger.error(`Error in getTopSearchedProducts: ${error.message}`);
    next(error);
  }
};

export { getTopSearchedProducts, exportTopSearchedProducts };
