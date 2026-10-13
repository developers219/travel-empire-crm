import "dotenv/config";
import { pool, testDatabaseConnection } from "./config/database.js";
import app from "./app.js";

let server;

const shutdown = async () => {
  server?.close();
  await pool.end();
};

const startServer = async () => {
  try {
    const port = process.env.PORT;
    if (!port) {
      throw new Error("PORT is not configured in .env");
    }
    await testDatabaseConnection();
    server = app.listen(port, () => {
      console.log(`Travel Empire CRM API running on PORT: ${port}`);
    });
    server.on("error", async (error) => {
      console.error("Server error:", error);
      await shutdown();
      process.exitCode = 1;
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exitCode = 1;
  }
};

startServer();
