const express = require("express");
const router = express.Router();
const plotController = require("../controllers/plotController");

// Plot routes
router.post("/", plotController.createPlot);
router.get("/", plotController.getAllPlots);
router.get("/:id", plotController.getPlot);
router.put("/:id", plotController.updatePlot);
router.delete("/:id", plotController.deletePlot);

module.exports = router;
