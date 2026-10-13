import * as leadService from "../services/lead.service.js";
import { parseId, sendError } from "../utils/handleError.js";

const LEAD_STATUSES = ["new", "assigned"];

const notFound = (res) =>
  res.status(404).json({ success: false, message: "Lead not found" });

export const getAllLeads = async (req, res) => {
  try {
    const { status, assignedTo, search } = req.query;

    if (status !== undefined && !LEAD_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be 'new' or 'assigned'",
      });
    }
    if (
      assignedTo !== undefined &&
      assignedTo !== "unassigned" &&
      !parseId(assignedTo)
    ) {
      return res.status(400).json({
        success: false,
        message: "assignedTo must be an executive id or 'unassigned'",
      });
    }

    const leads = await leadService.getAllLeads(req.user, {
      status,
      assignedTo,
      search: search?.trim() || undefined,
    });
    return res.status(200).json({ success: true, data: leads });
  } catch (error) {
    return sendError(res, error, "Failed to fetch leads");
  }
};

export const getLeadById = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid lead id" });
    }
    const lead = await leadService.getLeadById(req.user, id);
    if (!lead) return notFound(res);
    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    return sendError(res, error, "Failed to fetch lead");
  }
};

export const getLeadByEmail = async (req, res) => {
  try {
    const lead = await leadService.getLeadByEmail(req.params.email);
    if (!lead) return notFound(res);
    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    return sendError(res, error, "Failed to fetch lead");
  }
};

export const getLeadByName = async (req, res) => {
  try {
    const lead = await leadService.getLeadByName(req.params.name);
    if (!lead) return notFound(res);
    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    return sendError(res, error, "Failed to fetch lead");
  }
};

export const createLead = async (req, res) => {
  try {
    const lead = await leadService.createLead(req.body);
    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    return sendError(res, error, "Failed to create lead");
  }
};

export const updateLeadById = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid lead id" });
    }
    const lead = await leadService.updateLead(req.user, req.body, id);
    if (!lead) return notFound(res);
    return res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    return sendError(res, error, "Failed to update lead");
  }
};

export const deleteLeadById = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid lead id" });
    }
    const deleted = await leadService.deleteLead(id);
    if (!deleted) return notFound(res);
    return res
      .status(200)
      .json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    return sendError(res, error, "Failed to delete lead");
  }
};
