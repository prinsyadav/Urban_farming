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

require("dotenv").config();

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

// For debugging
console.log("Starting server with environment:");
console.log("CLERK_SECRET_KEY exists:", !!process.env.CLERK_SECRET_KEY);
console.log("CLERK_WEBHOOK_SECRET exists:", !!process.env.CLERK_WEBHOOK_SECRET);

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
    // For requests without an origin header (like Postman or webhook calls)
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

// Special handling for the webhook route to get raw body
app.use((req, res, next) => {
  if (req.path === "/api/clerk-webhooks" && req.method === "POST") {
    express.raw({ type: "application/json" })(req, res, next);
  } else {
    next();
  }
});

// Regular body parsers for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", clerkWebhookRoutes);
app.use("/api/plots", plotRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/harvest-schedules", harvestScheduleRoutes);
app.use("/api/crop-rotations", cropRotationRoutes);

// Simple route to check server status
app.get("/api/status", (req, res) => {
  res.json({
    status: "Server is running",
    env: {
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? "Set" : "Not set",
      CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET
        ? "Set"
        : "Not set",
    },
  });
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
      "/api/clerk-webhooks",
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
