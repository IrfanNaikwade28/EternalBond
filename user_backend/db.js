const mysql = require("mysql");

// Create MySQL connection pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",          // Your DB username
  password: "", // Your DB password
  database: "matrimony_db",   // Your DB name
  port: 3306
});

// Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Database connected successfully!");
    connection.release();
  }
});

module.exports = db;
