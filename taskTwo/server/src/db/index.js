import { Sequelize } from "sequelize";
import logger from "../utils/logger.js";

const sequelize = new Sequelize("ecommerce", "postgres", "admin", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Connection has been established successfully.");
  } catch (error) {
    logger.error(`Unable to connect to the database: ${error.message}`);
  }
};

export { connectDB, sequelize };
