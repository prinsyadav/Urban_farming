const express = require("express");
const router = express.Router();
const cropRotationController = require("../controllers/cropRotationController");

// Crop rotation routes
router.post("/", cropRotationController.createCropRotation);
router.get("/", cropRotationController.getAllCropRotations);
router.get("/:id", cropRotationController.getCropRotation);
router.put("/:id", cropRotationController.updateCropRotation);
router.delete("/:id", cropRotationController.deleteCropRotation);

// Additional route to get crop rotations by plot ID
router.get("/plot/:plotId", cropRotationController.getCropRotationsByPlot);

module.exports = router;
