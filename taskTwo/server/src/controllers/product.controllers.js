import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import logger from "../utils/logger.js";
import { Op } from "sequelize";

// query hepler function
const parseProductQuery = (query) => {
  // Get page and limit from query params, default to page 1, 10 product per page
  let page = parseInt(query.page) || 1;
  let limit = parseInt(query.limit) || 10;
  let offset = (page - 1) * limit;

  let sortBy = query.sortBy || "createdAt";
  let order = query.order?.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const where = {};

  if (query.category?.trim()) {
    where.category = query.category;
  }

  if (query.search?.trim()) {
    where.name = { [Op.iLike]: `%${query.search}%` };
  }

  // Price filters
  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price[Op.gte] = parseFloat(query.minPrice);
    if (query.maxPrice) where.price[Op.lte] = parseFloat(query.maxPrice);
  }

  // Date filters (createdAt)
  if (query.startDate || query.endDate) {
    where.createdAt = {};
    if (query.startDate) where.createdAt[Op.gte] = new Date(query.startDate);
    if (query.endDate) where.createdAt[Op.lte] = new Date(query.endDate);
  }

  return { page, limit, offset, sortBy, order, where };
};

const createProduct = async (req, res, next) => {
  try {
    const { name, price, stock, category } = req.body;

    const productImageLocalPath = req.files?.productImage?.[0]?.path;

    if (!productImageLocalPath) {
      logger.warn("Product creation missing product image");
      throw new ApiError(400, "product image file is required");
    }

    const productImage = await uploadOnCloudinary(productImageLocalPath);

    const product = await Product.create({
      name,
      price,
      stock,
      productImage: {
        url: productImage.url,
        public_id: productImage.public_id,
      },
      category,
    });

    const createdProduct = await Product.findOne({ where: { id: product.id } });

    logger.info("✅ Product created successfully");

    return res.status(201).json({
      data: createdProduct,
      message: "✅ Product created successfully",
    });
  } catch (error) {
    logger.error(`Error in creating product: ${error.message}`);
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { page, limit, offset, sortBy, order, where } = parseProductQuery(
      req.query
    );

    const { count, rows } = await Product.findAndCountAll({
      where,
      offset,
      limit,
      order: [[sortBy, order]],
    });

    if (count === 0 || rows.length === 0) {
      throw new ApiError(404, "products not found ");
    }

    logger.info("Products fetched successfully");

    return res.status(200).json({
      page,
      limit,
      totalProducts: count,
      products: rows,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    logger.error(`Error in getUser controller: ${error.message}`);
    next(error);
  }
};

export { createProduct, getProducts };
