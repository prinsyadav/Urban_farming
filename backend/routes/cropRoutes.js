const express = require("express");
const router = express.Router();
const cropController = require("../controllers/cropController");

// Crop routes
router.post("/", cropController.createCrop);
router.get("/", cropController.getAllCrops);
router.get("/:id", cropController.getCrop);
router.put("/:id", cropController.updateCrop);
router.delete("/:id", cropController.deleteCrop);

// Additional route to get all crops by plot ID
router.get("/plot/:plotId", cropController.getCropsByPlot);

module.exports = router;
