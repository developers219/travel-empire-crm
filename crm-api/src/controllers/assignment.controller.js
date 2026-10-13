import * as assignmentService from "../services/assignment.service.js";
import AppError from "../utils/appError.js";

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

export const assignLead = async (req, res) => {
  try {
    const leadId = parseId(req.params.id);
    if (!leadId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid lead id" });
    }

    const lead = await assignmentService.assignLead({
      leadId,
      assignedTo: Number(req.body.assignedTo),
      assignedBy: req.user.id,
      reason: req.body.reason?.trim() || null,
    });

    return res.status(200).json({
      success: true,
      message: "Lead assigned successfully",
      data: lead,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    console.error("Error in assigning lead: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to assign lead" });
  }
};

export const getAssignmentHistory = async (req, res) => {
  try {
    const leadId = parseId(req.params.id);
    if (!leadId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid lead id" });
    }

    const history = await assignmentService.getAssignmentHistory(leadId);
    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    console.error("Error in fetching assignment history: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch assignment history" });
  }
};
