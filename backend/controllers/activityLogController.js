const ActivityLog = require("../models/ActivityLog");
const Plot = require("../models/Plots");

// Get all activity logs
exports.getAllActivityLogs = async (req, res) => {
  try {
    const activityLogs = await ActivityLog.findAll({
      include: [
        {
          model: Plot,
          as: "plot",
          attributes: ["plot_id", "location", "soil_type"],
        },
      ],
      order: [["date", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: activityLogs.length,
      data: activityLogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
};

// Get activity logs by plot ID
exports.getActivityLogsByPlot = async (req, res) => {
  try {
    const activityLogs = await ActivityLog.findAll({
      where: { plot_id: req.params.plotId },
      include: [
        {
          model: Plot,
          as: "plot",
          attributes: ["plot_id", "location", "soil_type"],
        },
      ],
      order: [["date", "DESC"]],
    });

    if (!activityLogs.length) {
      return res.status(404).json({
        success: false,
        error: "No activity logs found for this plot",
      });
    }

    res.status(200).json({
      success: true,
      count: activityLogs.length,
      data: activityLogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
};

// Get activity logs by type
exports.getActivityLogsByType = async (req, res) => {
  try {
    const activityLogs = await ActivityLog.findAll({
      where: { type: req.params.type },
      include: [
        {
          model: Plot,
          as: "plot",
          attributes: ["plot_id", "location", "soil_type"],
        },
      ],
      order: [["date", "DESC"]],
    });

    if (!activityLogs.length) {
      return res.status(404).json({
        success: false,
        error: `No ${req.params.type} activity logs found`,
      });
    }

    res.status(200).json({
      success: true,
      count: activityLogs.length,
      data: activityLogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
};

// Get single activity log
exports.getActivityLog = async (req, res) => {
  try {
    const activityLog = await ActivityLog.findByPk(req.params.id, {
      include: [
        {
          model: Plot,
          as: "plot",
          attributes: ["plot_id", "location", "soil_type"],
        },
      ],
    });

    if (!activityLog) {
      return res.status(404).json({
        success: false,
        error: "Activity log not found",
      });
    }

    res.status(200).json({
      success: true,
      data: activityLog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
};

// Create new activity log
exports.createActivityLog = async (req, res) => {
  try {
    const { plot_id, type, date, notes } = req.body;

    // Check if plot exists
    const plot = await Plot.findByPk(plot_id);
    if (!plot) {
      return res.status(404).json({
        success: false,
        error: "Plot not found",
      });
    }

    const activityLog = await ActivityLog.create({
      plot_id,
      type,
      date: date || new Date(),
      notes,
    });

    res.status(201).json({
      success: true,
      data: activityLog,
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

// Update activity log
exports.updateActivityLog = async (req, res) => {
  try {
    const activityLog = await ActivityLog.findByPk(req.params.id);

    if (!activityLog) {
      return res.status(404).json({
        success: false,
        error: "Activity log not found",
      });
    }

    await activityLog.update(req.body);

    res.status(200).json({
      success: true,
      data: activityLog,
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

// Delete activity log
exports.deleteActivityLog = async (req, res) => {
  try {
    const activityLog = await ActivityLog.findByPk(req.params.id);

    if (!activityLog) {
      return res.status(404).json({
        success: false,
        error: "Activity log not found",
      });
    }

    await activityLog.destroy();

    res.status(200).json({
      success: true,
      data: {},
      message: "Activity log deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
};
