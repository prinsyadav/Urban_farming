const express = require("express");
const router = express.Router();
const plotController = require("../controllers/plotController");

// Plot routes
router.post("/", plotController.createPlot);
router.get("/", plotController.getAllPlots);
router.get("/:id", plotController.getPlot);
router.put("/:id", plotController.updatePlot);
router.delete("/:id", plotController.deletePlot);

// Add a new route to get plots by owner ID
router.get("/owner/:ownerId", plotController.getPlotsByOwner);

module.exports = router;
