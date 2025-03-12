const CropRotation = require("../models/CropRotation");
const Plot = require("../models/Plots");

// Get all crop rotations
exports.getAllCropRotations = async (req, res) => {
  try {
    const cropRotations = await CropRotation.findAll({
      include: [
        {
          model: Plot,
          as: "plot",
          attributes: ["plot_id", "location", "soil_type"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: cropRotations.length,
      data: cropRotations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
};

// Get crop rotations by plot ID
exports.getCropRotationsByPlot = async (req, res) => {
  try {
    const cropRotations = await CropRotation.findAll({
      where: { plot_id: req.params.plotId },
      include: [
        {
          model: Plot,
          as: "plot",
          attributes: ["plot_id", "location", "soil_type"],
        },
      ],
    });

    if (!cropRotations.length) {
      return res.status(404).json({
        success: false,
        error: "No crop rotations found for this plot",
      });
    }

    res.status(200).json({
      success: true,
      count: cropRotations.length,
      data: cropRotations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
};

// Get single crop rotation
exports.getCropRotation = async (req, res) => {
  try {
    const cropRotation = await CropRotation.findByPk(req.params.id, {
      include: [
        {
          model: Plot,
          as: "plot",
          attributes: ["plot_id", "location", "soil_type"],
        },
      ],
    });

    if (!cropRotation) {
      return res.status(404).json({
        success: false,
        error: "Crop rotation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: cropRotation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
};

// Create new crop rotation
exports.createCropRotation = async (req, res) => {
  try {
    const { plot_id, previous_crop, next_crop, rotation_date } = req.body;

    // Check if plot exists
    const plot = await Plot.findByPk(plot_id);
    if (!plot) {
      return res.status(404).json({
        success: false,
        error: "Plot not found",
      });
    }

    const cropRotation = await CropRotation.create({
      plot_id,
      previous_crop,
      next_crop,
      rotation_date,
    });

    res.status(201).json({
      success: true,
      data: cropRotation,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Server Error: " + error.message,
      });
    }
  }
};

// Update crop rotation
exports.updateCropRotation = async (req, res) => {
  try {
    const cropRotation = await CropRotation.findByPk(req.params.id);

    if (!cropRotation) {
      return res.status(404).json({
        success: false,
        error: "Crop rotation not found",
      });
    }

    await cropRotation.update(req.body);

    res.status(200).json({
      success: true,
      data: cropRotation,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Server Error: " + error.message,
      });
    }
  }
};

// Delete crop rotation
exports.deleteCropRotation = async (req, res) => {
  try {
    const cropRotation = await CropRotation.findByPk(req.params.id);

    if (!cropRotation) {
      return res.status(404).json({
        success: false,
        error: "Crop rotation not found",
      });
    }

    await cropRotation.destroy();

    res.status(200).json({
      success: true,
      data: {},
      message: "Crop rotation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
};
