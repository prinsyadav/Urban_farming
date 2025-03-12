const express = require("express");
const router = express.Router();
const harvestScheduleController = require("../controllers/harvestScheduleController");

// Harvest schedule routes
router.post("/", harvestScheduleController.createHarvestSchedule);
router.get("/", harvestScheduleController.getAllHarvestSchedules);
router.get("/:id", harvestScheduleController.getHarvestSchedule);
router.put("/:id", harvestScheduleController.updateHarvestSchedule);
router.delete("/:id", harvestScheduleController.deleteHarvestSchedule);

// Additional routes for filtering
router.get(
  "/plot/:plotId",
  harvestScheduleController.getHarvestSchedulesByPlot
);
router.get(
  "/crop/:cropId",
  harvestScheduleController.getHarvestSchedulesByCrop
);

module.exports = router;
