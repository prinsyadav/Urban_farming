const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Plot = sequelize.define(
  "Plot",
  {
    plot_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    owner_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    soil_type: {
      type: DataTypes.ENUM("clay", "sandy", "loamy", "silt", "peat"),
      allowNull: false,
    },
    lease_start: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    lease_end: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "pending"),
      defaultValue: "active",
    },
  },
  {
    tableName: "Plots",
    // timestamps: true,
  }
);

// Define association with Crop model (will be loaded when Plot is imported)
// This is called after Crop model is defined
const initAssociations = () => {
  const Crop = require("./Crop");

  Plot.hasMany(Crop, {
    foreignKey: "plot_id",
    as: "crops",
  });
};

// Export both the model and the function to initialize associations
module.exports = Plot;
module.exports.initAssociations = initAssociations;
