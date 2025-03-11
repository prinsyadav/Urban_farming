const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Plot = require("./Plots");

const Crop = sequelize.define(
  "Crop",
  {
    crop_id: {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    variety: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    planting_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    harvest_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Planted", "Growing", "Harvested"),
      allowNull: false,
      defaultValue: "Planted",
    },
  },
  {
    tableName: "crops",
    // timestamps: true,
  }
);

// Define the association with Plot model
Crop.belongsTo(Plot, {
  foreignKey: "plot_id",
  targetKey: "plot_id",
  as: "plot",
});

module.exports = Crop;
