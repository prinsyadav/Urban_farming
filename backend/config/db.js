const path = require("path");
const { Sequelize } = require("sequelize");

// Configure environment variables
const envPath = path.resolve(__dirname, "../.env");
require("dotenv").config({ path: envPath });

// Create a connection to the database using environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  String(process.env.DB_PASSWORD),
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // This allows connecting to self-signed certificates
      },
    },
  }
);

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(
      "Database connection to Aiven PostgreSQL established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the Aiven database:", error);
  }
}

// Run the test connection
testConnection();

module.exports = sequelize;
