const express = require("express");
const app = express();
const port = 3000;

// Allow CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST");
  next();
});

// Middleware to parse JSON requests
app.use(express.json());

// Role-based greeting endpoint
app.post("/api/greeting", async (req, res) => {
  const { role, userId } = req.body;

  // Verify the role from user metadata
  try {
    // In a production environment, you should verify the user's role
    // by checking the Clerk session token and validating against your backend

    if (role === "admin") {
      res.json({ message: "Hello admin" });
    } else if (role === "user") {
      res.json({ message: "Hello user" });
    } else {
      res.status(400).json({ error: "Invalid role" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error verifying user role" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
