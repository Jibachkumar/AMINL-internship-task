import { Sequelize } from "sequelize";

const sequelize = new Sequelize("ecommerce", "postgres", "admin", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { connectDB, sequelize };
