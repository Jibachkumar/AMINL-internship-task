import { app } from "./app.js";
import { connectDB, sequelize } from "./db/index.js";
import { User } from "./models/user.models.js";

(async () => {
  try {
    await connectDB();

    await sequelize.sync({ force: false });
    console.log("model synced successfully");
    app.listen(5000, () => {
      console.log(`Server is running at port localhost:5000`);
    });
  } catch (error) {
    console.log(`mongoDB connection failed !!!, ${error}`);
  }
})();
