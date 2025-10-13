import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";
import { Product } from "./product.models.js";

export const SearchLog = sequelize.define(
  "SearchLog",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Product, key: "id" },
    },
  },
  {
    tableName: "searchlogs",
  }
);

// Define associations
Product.hasMany(SearchLog, { foreignKey: "productId" });
SearchLog.belongsTo(Product, { foreignKey: "productId", as: "product" });
