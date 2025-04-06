// const express = require("express");
// const app = express();
// const port = 3000;
// const sequelize = require("./config/db");
// const plotRoutes = require("./routes/plotRoutes");
// const cropRoutes = require("./routes/cropRoutes");
// const activityLogRoutes = require("./routes/activityLogRoutes");
// const harvestScheduleRoutes = require("./routes/harvestScheduleRoutes");
// const cropRotationRoutes = require("./routes/cropRotationRoutes");

// // Allow CORS
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

//   // Handle preflight requests
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(204);
//   }

//   next();
// });

// // Middleware to parse JSON requests
// app.use(express.json());

// // Routes
// app.use("/api/plots", plotRoutes);
// app.use("/api/crops", cropRoutes);
// app.use("/api/activity-logs", activityLogRoutes);
// app.use("/api/harvest-schedules", harvestScheduleRoutes);
// app.use("/api/crop-rotations", cropRotationRoutes);

// // Simple route to check server status
// app.get("/api/status", (req, res) => {
//   res.json({ status: "Server is running" });
// });

// // Sync database and start server
// const initServer = async () => {
//   try {
//     // Sync all models with database
//     await sequelize.sync({ alter: true });
//     console.log("Database synchronized successfully");

//     // Start the server
//     app.listen(port, () => {
//       console.log(`Server listening on port ${port}`);
//     });
//   } catch (error) {
//     console.error("Failed to initialize server:", error);
//   }
// };

// initServer();

// 2

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const sequelize = require("./config/db");
const plotRoutes = require("./routes/plotRoutes");
const cropRoutes = require("./routes/cropRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");
const harvestScheduleRoutes = require("./routes/harvestScheduleRoutes");
const cropRotationRoutes = require("./routes/cropRotationRoutes");
const clerkWebhookRoutes = require("./routes/clerkWebhookRoutes");

// Allow CORS with specific origins
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://urban-farming-chi.vercel.app",
    "http://localhost:5173", // For local Vite development
    "http://localhost:3000", // For local development
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    // For requests without an origin header (like Postman)
    res.header("Access-Control-Allow-Origin", "*");
  }

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use("/api/clerk-webhooks", express.raw({ type: "application/json" }));

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", require("./routes/clerkWebhookRoutes"));
app.use("/api/plots", plotRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/harvest-schedules", harvestScheduleRoutes);
app.use("/api/crop-rotations", cropRotationRoutes);

// Simple route to check server status
app.get("/api/status", (req, res) => {
  res.json({ status: "Server is running" });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Urban Farming API is running",
    endpoints: [
      "/api/plots",
      "/api/crops",
      "/api/activity-logs",
      "/api/harvest-schedules",
      "/api/crop-rotations",
      "/api/status",
    ],
  });
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
