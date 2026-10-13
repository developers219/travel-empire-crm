import * as leadRepository from "../repositories/lead.repository.js";

const MANAGER_ROLES = ["admin", "sales_manager"];
const canSeeAll = (user) => MANAGER_ROLES.includes(user.role);

export const getAllLeads = async (user, filters = {}) => {
  const finalFilters = { ...filters };
  if (!canSeeAll(user)) finalFilters.assignedTo = String(user.id);
  return leadRepository.findAll(finalFilters);
};

export const getLeadById = async (user, id) => {
  const lead = await leadRepository.findById(id);
  if (!lead) return null;
  if (!canSeeAll(user) && lead.assignedTo !== user.id) return null;
  return lead;
};

export const getLeadByEmail = async (email) => {
  return leadRepository.findByEmail(email);
};

export const getLeadByName = async (name) => {
  return leadRepository.findByName(name);
};

export const createLead = async (data) => {
  return leadRepository.createLead(data);
};

export const updateLead = async (user, data, id) => {
  const lead = await getLeadById(user, id);
  if (!lead) return null;
  return leadRepository.updateLeadById(data, id);
};

export const deleteLead = async (id) => {
  return leadRepository.deleteLeadById(id);
};
