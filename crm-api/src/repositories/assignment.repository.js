import { pool } from "../config/database.js";

export const findLeadForUpdate = async (connection, leadId) => {
  const [rows] = await connection.execute(
    `SELECT id, assigned_to AS assignedTo FROM leads WHERE id = ? FOR UPDATE`,
    [leadId],
  );
  return rows[0] || null;
};

export const findUserById = async (connection, userId) => {
  const [rows] = await connection.execute(
    `SELECT id, full_name AS fullName, role, is_active AS isActive
     FROM crm_users WHERE id = ? LIMIT 1`,
    [userId],
  );
  return rows[0] || null;
};

export const updateLeadAssignment = async (connection, leadId, userId) => {
  await connection.execute(
    `UPDATE leads
     SET assigned_to = ?, status = 'assigned', assigned_at = NOW()
     WHERE id = ?`,
    [userId, leadId],
  );
};

export const insertAssignment = async (connection, data) => {
  await connection.execute(
    `INSERT INTO crm_lead_assignments (lead_id, assigned_to, assigned_by, reason)
     VALUES (?, ?, ?, ?)`,
    [data.leadId, data.assignedTo, data.assignedBy, data.reason ?? null],
  );
};

export const findHistoryByLeadId = async (leadId) => {
  const [rows] = await pool.execute(
    `SELECT a.id,
            a.lead_id AS leadId,
            a.assigned_to AS assignedTo,
            u_to.full_name AS assignedToName,
            a.assigned_by AS assignedBy,
            u_by.full_name AS assignedByName,
            a.reason,
            a.created_at AS createdAt
     FROM crm_lead_assignments a
     JOIN crm_users u_to ON a.assigned_to = u_to.id
     JOIN crm_users u_by ON a.assigned_by = u_by.id
     WHERE a.lead_id = ?
     ORDER BY a.id DESC`,
    [leadId],
  );
  return rows;
};
