import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { User } from "./user.models.js";

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "messages",
  }
);

// Define associations
User.hasMany(Message, { foreignKey: "senderId" });
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });

User.hasMany(Message, { foreignKey: "receiverId" });
Message.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

export { Message };
