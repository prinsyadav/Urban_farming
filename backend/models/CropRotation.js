const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Plot = require("./Plots");

const CropRotation = sequelize.define(
  "CropRotation",
  {
    rotation_id: {
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
    previous_crop: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    next_crop: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rotation_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "crop_rotations",
    timestamps: true,
  }
);

// Define association with Plot model
CropRotation.belongsTo(Plot, {
  foreignKey: "plot_id",
  targetKey: "plot_id",
  as: "plot",
});

module.exports = CropRotation;
