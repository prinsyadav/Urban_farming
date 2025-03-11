const Crop = require("../models/Crop");
const Plot = require("../models/Plots");

// Create a new crop
exports.createCrop = async (req, res) => {
  try {
    const crop = await Crop.create(req.body);
    res.status(201).json({
      success: true,
      data: crop,
    });
  } catch (error) {
    console.error("Error creating crop:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create crop",
      error: error.message,
    });
  }
};

// Get all crops with optional filtering
exports.getAllCrops = async (req, res) => {
  try {
    const { plotId } = req.query;
    const conditions = {};

    // Filter by plot_id if provided
    if (plotId) {
      conditions.plot_id = plotId;
    }

    const crops = await Crop.findAll({
      where: conditions,
      include: [
        {
          model: Plot,
          as: "plot",
          attributes: ["location", "size", "soil_type", "status"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (crops.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No crops found",
      });
    }

    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops,
    });
  } catch (error) {
    console.error("Error fetching crops:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch crops",
      error: error.message,
    });
  }
};

// Get crops by specific plot ID
exports.getCropsByPlot = async (req, res) => {
  try {
    const { plotId } = req.params;

    const crops = await Crop.findAll({
      where: { plot_id: plotId },
      include: [
        {
          model: Plot,
          as: "plot",
          attributes: ["location", "size", "soil_type", "status"],
        },
      ],
      order: [["planting_date", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops,
    });
  } catch (error) {
    console.error("Error fetching crops by plot:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch crops for this plot",
      error: error.message,
    });
  }
};

// Get a single crop
exports.getCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const crop = await Crop.findByPk(id, {
      include: [
        {
          model: Plot,
          as: "plot",
          attributes: ["location", "size", "soil_type"],
        },
      ],
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: `Crop with id ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: crop,
    });
  } catch (error) {
    console.error("Error fetching crop:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch crop",
      error: error.message,
    });
  }
};

// Update a crop
exports.updateCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const crop = await Crop.findByPk(id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: `Crop with id ${id} not found`,
      });
    }

    await crop.update(req.body);

    res.status(200).json({
      success: true,
      data: crop,
    });
  } catch (error) {
    console.error("Error updating crop:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update crop",
      error: error.message,
    });
  }
};

// Delete a crop
exports.deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const crop = await Crop.findByPk(id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: `Crop with id ${id} not found`,
      });
    }

    await crop.destroy();

    res.status(200).json({
      success: true,
      message: "Crop deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting crop:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete crop",
      error: error.message,
    });
  }
};
