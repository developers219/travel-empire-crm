import { pool } from "../config/database.js";
import AppError from "../utils/appError.js";
import * as assignmentRepository from "../repositories/assignment.repository.js";
import * as leadRepository from "../repositories/lead.repository.js";

const ASSIGNER_ROLES = ["admin", "sales_manager"];

export const assignLead = async ({
  leadId,
  assignedTo,
  assignedBy,
  reason,
}) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const lead = await assignmentRepository.findLeadForUpdate(
      connection,
      leadId,
    );
    if (!lead) throw new AppError("Lead not found", 404);

    const executive = await assignmentRepository.findUserById(
      connection,
      assignedTo,
    );
    if (
      !executive ||
      executive.role !== "sales_executive" ||
      !executive.isActive
    ) {
      throw new AppError("assignedTo must be an active sales executive", 400);
    }

    const assigner = await assignmentRepository.findUserById(
      connection,
      assignedBy,
    );
    if (
      !assigner ||
      !ASSIGNER_ROLES.includes(assigner.role) ||
      !assigner.isActive
    ) {
      throw new AppError("assignedBy must be an active admin or manager", 403);
    }

    if (lead.assignedTo === assignedTo) {
      throw new AppError("Lead is already assigned to this executive", 409);
    }

    await assignmentRepository.updateLeadAssignment(
      connection,
      leadId,
      assignedTo,
    );
    await assignmentRepository.insertAssignment(connection, {
      leadId,
      assignedTo,
      assignedBy,
      reason,
    });

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return leadRepository.findById(leadId);
};

export const getAssignmentHistory = async (leadId) => {
  const lead = await leadRepository.findById(leadId);
  if (!lead) throw new AppError("Lead not found", 404);
  return assignmentRepository.findHistoryByLeadId(leadId);
};
