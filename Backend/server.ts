import dotenv from "dotenv";
import app from "./src/app";
import pool from "./src/config/database";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL connected successfully");

    connection.release();

    app.listen(PORT, () => {
      console.log(`Monitorly API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MySQL connection failed:", error);
  }
};

startServer();
