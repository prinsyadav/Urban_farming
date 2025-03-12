const express = require("express");
const router = express.Router();
const activityLogController = require("../controllers/activityLogController");

// Activity log routes
router.post("/", activityLogController.createActivityLog);
router.get("/", activityLogController.getAllActivityLogs);
router.get("/:id", activityLogController.getActivityLog);
router.put("/:id", activityLogController.updateActivityLog);
router.delete("/:id", activityLogController.deleteActivityLog);

// Additional routes for filtering
router.get("/plot/:plotId", activityLogController.getActivityLogsByPlot);
router.get("/type/:type", activityLogController.getActivityLogsByType);

module.exports = router;
