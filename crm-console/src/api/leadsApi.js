import { request } from "./http.js";

export const getLeads = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const query = params.toString();
  return request(`/leads${query ? `?${query}` : ""}`);
};

export const createLead = (data) =>
  request("/leads", { method: "POST", body: JSON.stringify(data) });

export const updateLead = (id, data) =>
  request(`/leads/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteLead = (id) => request(`/leads/${id}`, { method: "DELETE" });

export const assignLead = (id, assignedTo, reason) =>
  request(`/leads/${id}/assign`, {
    method: "POST",
    body: JSON.stringify({ assignedTo, reason }),
  });

export const getAssignmentHistory = (id) => request(`/leads/${id}/assignments`);
