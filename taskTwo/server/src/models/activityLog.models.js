import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";
import { User } from "../models/user.models.js";

const ActivityLog = sequelize.define(
  "ActivityLog",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        Model: User,
        key: "id",
      },
      onDelete: "CASCADE", // delete logs if user is deleted"
    },
    action: {
      type: DataTypes.STRING, // e.g., "LOGIN", "LOGOUT"
      allowNull: false,
    },
    details: {
      type: DataTypes.JSON, // optional: extra data
    },
  },
  { tableName: "activitylogs" }
);

// Associations
User.hasMany(ActivityLog, { foreignKey: "userId" });
ActivityLog.belongsTo(User, { foreignKey: "userId" });

export { ActivityLog };
