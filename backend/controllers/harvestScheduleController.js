const HarvestSchedule = require("../models/HarvestSchedule");
const Plot = require("../models/Plots");
const Crop = require("../models/Crop");

// Get all harvest schedules
exports.getAllHarvestSchedules = async (req, res) => {
  try {
    const harvestSchedules = await HarvestSchedule.findAll({
      include: [
        {
          model: Plot,
          as: "plot",
          attributes: ["plot_id", "location", "soil_type"],
        },
        {
          model: Crop,
          as: "crop",
          attributes: ["crop_id", "name", "variety", "status"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: harvestSchedules.length,
      data: harvestSchedules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
};

// Get harvest schedules by plot ID
exports.getHarvestSchedulesByPlot = async (req, res) => {
  try {
    const harvestSchedules = await HarvestSchedule.findAll({
      where: { plot_id: req.params.plotId },
      include: [
        {
          model: Plot,
          as: "plot",
          attributes: ["plot_id", "location", "soil_type"],
        },
        {
          model: Crop,
          as: "crop",
          attributes: ["crop_id", "name", "variety", "status"],
        },
      ],
    });

    if (!harvestSchedules.length) {
      return res.status(404).json({
        success: false,
        error: "No harvest schedules found for this plot",
      });
    }

    res.status(200).json({
      success: true,
      count: harvestSchedules.length,
      data: harvestSchedules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
};

// Get harvest schedules by crop ID
exports.getHarvestSchedulesByCrop = async (req, res) => {
  try {
    const harvestSchedules = await HarvestSchedule.findAll({
      where: { crop_id: req.params.cropId },
      include: [
        {
          model: Plot,
          as: "plot",
          attributes: ["plot_id", "location", "soil_type"],
        },
        {
          model: Crop,
          as: "crop",
          attributes: ["crop_id", "name", "variety", "status"],
        },
      ],
    });

    if (!harvestSchedules.length) {
      return res.status(404).json({
        success: false,
        error: "No harvest schedules found for this crop",
      });
    }

    res.status(200).json({
      success: true,
      count: harvestSchedules.length,
      data: harvestSchedules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
};

// Get single harvest schedule
exports.getHarvestSchedule = async (req, res) => {
  try {
    const harvestSchedule = await HarvestSchedule.findByPk(req.params.id, {
      include: [
        {
          model: Plot,
          as: "plot",
          attributes: ["plot_id", "location", "soil_type"],
        },
        {
          model: Crop,
          as: "crop",
          attributes: ["crop_id", "name", "variety", "status"],
        },
      ],
    });

    if (!harvestSchedule) {
      return res.status(404).json({
        success: false,
        error: "Harvest schedule not found",
      });
    }

    res.status(200).json({
      success: true,
      data: harvestSchedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
};

// Create new harvest schedule
exports.createHarvestSchedule = async (req, res) => {
  try {
    const { plot_id, crop_id, expected_harvest_date, actual_harvest_date } =
      req.body;

    // Check if plot exists
    const plot = await Plot.findByPk(plot_id);
    if (!plot) {
      return res.status(404).json({
        success: false,
        error: "Plot not found",
      });
    }

    // Check if crop exists
    const crop = await Crop.findByPk(crop_id);
    if (!crop) {
      return res.status(404).json({
        success: false,
        error: "Crop not found",
      });
    }

    // Check if a harvest schedule already exists for this plot
    const existingSchedule = await HarvestSchedule.findOne({
      where: { plot_id: plot_id },
    });

    if (existingSchedule) {
      return res.status(409).json({
        success: false,
        error:
          "A harvest schedule already exists for this plot. Please update the existing schedule instead of creating a new one.",
        existingSchedule: existingSchedule,
      });
    }

    const harvestSchedule = await HarvestSchedule.create({
      plot_id,
      crop_id,
      expected_harvest_date,
      actual_harvest_date,
    });

    res.status(201).json({
      success: true,
      data: harvestSchedule,
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

// Update harvest schedule
exports.updateHarvestSchedule = async (req, res) => {
  try {
    const harvestSchedule = await HarvestSchedule.findByPk(req.params.id);

    if (!harvestSchedule) {
      return res.status(404).json({
        success: false,
        error: "Harvest schedule not found",
      });
    }

    // If we're changing the plot_id, check if a schedule already exists for the new plot
    if (req.body.plot_id && req.body.plot_id !== harvestSchedule.plot_id) {
      const existingSchedule = await HarvestSchedule.findOne({
        where: { plot_id: req.body.plot_id },
      });

      if (existingSchedule) {
        return res.status(409).json({
          success: false,
          error:
            "A harvest schedule already exists for the target plot. Cannot update to this plot.",
          existingSchedule: existingSchedule,
        });
      }
    }

    await harvestSchedule.update(req.body);

    res.status(200).json({
      success: true,
      data: harvestSchedule,
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

// Delete harvest schedule
exports.deleteHarvestSchedule = async (req, res) => {
  try {
    const harvestSchedule = await HarvestSchedule.findByPk(req.params.id);

    if (!harvestSchedule) {
      return res.status(404).json({
        success: false,
        error: "Harvest schedule not found",
      });
    }

    await harvestSchedule.destroy();

    res.status(200).json({
      success: true,
      data: {},
      message: "Harvest schedule deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
};
