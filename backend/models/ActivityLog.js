const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Plot = require("./Plots");

const ActivityLog = sequelize.define(
  "ActivityLog",
  {
    activity_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    plot_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Plot,
        key: "plot_id",
      },
    },
    type: {
      type: DataTypes.ENUM("Irrigation", "Fertilization"),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "activity_logs",
    timestamps: true,
  }
);

// Define association with Plot model
ActivityLog.belongsTo(Plot, {
  foreignKey: "plot_id",
  targetKey: "plot_id",
  as: "plot",
});

module.exports = ActivityLog;
