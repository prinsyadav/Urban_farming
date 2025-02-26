const Plot = require("../models/Plots");

// Create a new plot
exports.createPlot = async (req, res) => {
  try {
    const {
      plot_id,
      owner_id,
      size,
      location,
      soil_type,
      lease_start,
      lease_end,
    } = req.body;

    // Validate required fields
    if (
      !plot_id ||
      !owner_id ||
      !size ||
      !location ||
      !soil_type ||
      !lease_start ||
      !lease_end
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if plot with same ID already exists
    const existingPlot = await Plot.findByPk(plot_id);
    if (existingPlot) {
      return res.status(400).json({
        success: false,
        message: "Plot ID already exists",
      });
    }

    // Create the plot
    const newPlot = await Plot.create({
      plot_id,
      owner_id,
      size,
      location,
      soil_type,
      lease_start,
      lease_end,
    });

    return res.status(201).json({
      success: true,
      data: newPlot,
    });
  } catch (error) {
    console.error("Error creating plot:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get all plots
exports.getAllPlots = async (req, res) => {
  try {
    const plots = await Plot.findAll();

    return res.status(200).json({
      success: true,
      count: plots.length,
      data: plots,
    });
  } catch (error) {
    console.error("Error fetching plots:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get a single plot
exports.getPlot = async (req, res) => {
  try {
    const plot = await Plot.findByPk(req.params.id);

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: "Plot not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: plot,
    });
  } catch (error) {
    console.error("Error fetching plot:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Update plot
exports.updatePlot = async (req, res) => {
  try {
    const plot = await Plot.findByPk(req.params.id);

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: "Plot not found",
      });
    }

    const {
      owner_id,
      size,
      location,
      soil_type,
      lease_start,
      lease_end,
      status,
    } = req.body;

    await plot.update({
      owner_id: owner_id || plot.owner_id,
      size: size || plot.size,
      location: location || plot.location,
      soil_type: soil_type || plot.soil_type,
      lease_start: lease_start || plot.lease_start,
      lease_end: lease_end || plot.lease_end,
      status: status || plot.status,
    });

    return res.status(200).json({
      success: true,
      data: plot,
    });
  } catch (error) {
    console.error("Error updating plot:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Delete plot
exports.deletePlot = async (req, res) => {
  try {
    const plot = await Plot.findByPk(req.params.id);

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: "Plot not found",
      });
    }

    await plot.destroy();

    return res.status(200).json({
      success: true,
      message: "Plot deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting plot:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
