import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool } from "../config/database.js";

const run = async () => {
  const [users] = await pool.execute(
    `SELECT id, email, password_hash FROM crm_users`,
  );

  for (const user of users) {
    if (user.password_hash.startsWith("$2")) continue;
    const hash = await bcrypt.hash(user.password_hash, 10);
    await pool.execute(`UPDATE crm_users SET password_hash = ? WHERE id = ?`, [
      hash,
      user.id,
    ]);
    console.log(`Hashed password for ${user.email}`);
  }

  await pool.end();
};

export default run;
