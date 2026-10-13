import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: ["DATE"],
});

export const testDatabaseConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.ping();
    console.log("MySQL Database connected successfully");
  } catch (error) {
    console.error("Error in connecting:", error.message);
    throw error;
  } finally {
    connection?.release();
  }
};
