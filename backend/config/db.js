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
 