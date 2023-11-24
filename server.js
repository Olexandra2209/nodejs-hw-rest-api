require("dotenv").config();

const app = require("./app");
const mongoose = require("mongoose");
const { DB_URI } = process.env;

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Database connection successful");

    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
    process.exit(1);
  });
