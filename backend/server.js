const express = require("express");
const app = express();
const port = 3000;
const sequelize = require("./config/db");
const plotRoutes = require("./routes/plotRoutes");
const cropRoutes = require("./routes/cropRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");
const harvestScheduleRoutes = require("./routes/harvestScheduleRoutes");
const cropRotationRoutes = require("./routes/cropRotationRoutes");

// Allow CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use("/api/plots", plotRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/harvest-schedules", harvestScheduleRoutes);
app.use("/api/crop-rotations", cropRotationRoutes);

// Simple route to check server status
app.get("/api/status", (req, res) => {
  res.json({ status: "Server is running" });
});

// Sync database and start server
const initServer = async () => {
  try {
    // Sync all models with database
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully");

    // Start the server
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to initialize server:", error);
  }
};

initServer();
