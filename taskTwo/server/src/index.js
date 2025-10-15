import { server } from "./app.js";
import { connectDB, sequelize } from "./db/index.js";
import logger from "./utils/logger.js";
import { User } from "./models/user.models.js";
import { Product } from "./models/product.models.js";
import { Order } from "./models/order.models.js";

(async () => {
  try {
    await connectDB();

    await sequelize.sync({ force: false });
    logger.info("model synced successfully");
    server.listen(process.env.PORT, () => {
      logger.info(`Server is running at port localhost:${process.env.PORT}`);
      logger.info(`swagger at port localhost:${process.env.PORT}/api-docs`);
    });
  } catch (error) {
    logger.error(`mongoDB connection failed !!!, ${error}`);
  }
})();
