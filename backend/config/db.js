const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("UrabnFarm", "postgres", "annu", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  logging: false,
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();

module.exports = sequelize;

// Configure avien console remote Database using sequelize

// const { Sequelize } = require("sequelize");
// require("dotenv").config({ path: "../../.env" }); // Adjust path as needed to find your .env

// // Create a connection to the database using environment variables
// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: "postgres",
//     port: process.env.DB_PORT,
//     logging: false,
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false, // Changed this from true to false
//       },
//     },
//   }
// );

// // Test the connection
// async function testConnection() {
//   try {
//     await sequelize.authenticate();
//     console.log(
//       "Database connection to Aiven PostgreSQL established successfully."
//     );
//   } catch (error) {
//     console.error("Unable to connect to the Aiven database:", error);
//   }
// }

// // Run the test connection
// testConnection();

// module.exports = sequelize;
