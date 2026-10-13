import { pool } from "../config/database.js";

export const findActiveExecutives = async () => {
  const [rows] = await pool.execute(
    `SELECT id, full_name AS fullName, email
     FROM crm_users
     WHERE role = 'sales_executive' AND is_active = 1
     ORDER BY full_name`,
  );
  return rows;
};

export const findByEmail = async (email) => {
  const [rows] = await pool.execute(
    `SELECT id, full_name AS fullName, email, password_hash AS passwordHash,
            role, is_active AS isActive
     FROM crm_users WHERE email = ? LIMIT 1`,
    [email],
  );
  return rows[0] || null;
};

export const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, full_name AS fullName, email, role, is_active AS isActive
     FROM crm_users WHERE id = ? LIMIT 1`,
    [id],
  );
  return rows[0] || null;
};
