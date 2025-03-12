const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Plot = require("./Plots");
const Crop = require("./Crop");

const HarvestSchedule = sequelize.define(
  "HarvestSchedule",
  {
    schedule_id: {
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
    crop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Crop,
        key: "crop_id",
      },
    },
    expected_harvest_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    actual_harvest_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "harvest_schedules",
    timestamps: true,
  }
);

// Define associations
HarvestSchedule.belongsTo(Plot, {
  foreignKey: "plot_id",
  targetKey: "plot_id",
  as: "plot",
});

HarvestSchedule.belongsTo(Crop, {
  foreignKey: "crop_id",
  targetKey: "crop_id",
  as: "crop",
});

module.exports = HarvestSchedule;
