import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./db/index.js";
import logger from "./utils/logger.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      logger.info(`Server is running at port localhost:${process.env.PORT}`);
      logger.info(`swagger at port localhost:${process.env.PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.log(`mongoDB connection failed !!!, ${error}`);
  });
