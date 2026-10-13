import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, UserPlus } from "lucide-react";
import { getLeads, deleteLead } from "../api/leadsApi.js";
import { getExecutives } from "../api/usersApi.js";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import LeadFormModal from "../components/LeadFormModal.jsx";
import AssignLeadModal from "../components/AssignLeadModal.jsx";
import { useAuth } from "../hooks/useAuth.js";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const selectClass =
  "h-10 rounded-control border border-line bg-white px-3 text-[14px] outline-none focus:border-brand";

export default function LeadDistribution() {
  const { user } = useAuth();
  const isManager = ["admin", "sales_manager"].includes(user.role);
  const isAdmin = user.role === "admin";

  const [leads, setLeads] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [formLead, setFormLead] = useState(undefined);
  const [assignTarget, setAssignTarget] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!isManager) return;
    getExecutives()
      .then(setExecutives)
      .catch(() => {});
  }, [isManager]);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getLeads({ search, status, assignedTo });
        setLeads(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadLeads();
  }, [search, status, assignedTo, reloadKey]);

  const reload = () => setReloadKey((key) => key + 1);

  const handleDelete = async (lead) => {
    if (!window.confirm(`Delete lead #${lead.id} (${lead.fullName})?`)) return;
    try {
      await deleteLead(lead.id);
      reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const clearFilters = () => {
    setSearchInput("");
    setStatus("");
    setAssignedTo("");
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-bold">Leads</h1>
          <p className="text-[13px] text-muted">
            {isManager
              ? `${leads.length} leads`
              : `${leads.length} leads assigned to you`}
          </p>
        </div>
        {isManager && (
          <Button onClick={() => setFormLead(null)}>
            <Plus size={16} /> Add lead
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-card border border-line bg-white">
        <div className="flex flex-wrap items-center gap-3 p-4">
          <input
            placeholder="Search by name or phone"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-10 w-64 rounded-control border border-line px-3 outline-none focus:border-brand"
          />
          <select
            className={selectClass}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Status: All</option>
            <option value="new">New</option>
            <option value="assigned">Assigned</option>
          </select>
          {isManager && (
            <select
              className={selectClass}
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Assigned to: Anyone</option>
              <option value="unassigned">Unassigned</option>
              {executives.map((exec) => (
                <option key={exec.id} value={exec.id}>
                  {exec.fullName}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={clearFilters}
            className="ml-auto text-[13px] font-semibold text-brand-dark"
          >
            Clear filters
          </button>
        </div>

        {loading && <p className="p-6 text-muted">Loading...</p>}

        {error && (
          <p className="m-4 rounded-control border border-danger/30 bg-danger/5 p-3 text-danger">
            {error}
          </p>
        )}

        {!loading && !error && leads.length === 0 && (
          <p className="p-10 text-center text-muted">No leads found.</p>
        )}

        {!loading && !error && leads.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-brand-tint/40 text-[13px] text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Lead</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Departure</th>
                  <th className="px-4 py-3 font-semibold">Budget</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Assigned to</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="h-[54px] border-t border-line">
                    <td className="px-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-tint text-xs font-bold text-brand-dark">
                          {getInitials(lead.fullName)}
                        </span>
                        <div>
                          <p className="font-semibold leading-tight">
                            {lead.fullName}
                          </p>
                          <p className="text-[13px] text-muted">
                            Lead #{lead.id} · {lead.departureTo}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4">{lead.phoneNumber}</td>
                    <td className="px-4">{formatDate(lead.departureDate)}</td>
                    <td className="px-4">{lead.budget}</td>
                    <td className="px-4">
                      <Badge tone={lead.status === "new" ? "info" : "success"}>
                        {lead.status === "new" ? "New" : "Assigned"}
                      </Badge>
                    </td>
                    <td className="px-4">
                      {lead.assignedToName ? (
                        <div>
                          <p className="font-semibold leading-tight">
                            {lead.assignedToName}
                          </p>
                          <p className="text-[12px] text-muted">
                            {formatDate(lead.assignedAt)}
                          </p>
                        </div>
                      ) : (
                        <Badge tone="warning">Unassigned</Badge>
                      )}
                    </td>
                    <td className="px-4">
                      <div className="flex gap-2">
                        {isManager && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setAssignTarget(lead)}
                          >
                            <UserPlus size={14} />
                            {lead.assignedTo ? "Reassign" : "Assign"}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setFormLead(lead)}
                        >
                          <Pencil size={14} /> Edit
                        </Button>
                        {isAdmin && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(lead)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {formLead !== undefined && (
        <LeadFormModal
          lead={formLead}
          onClose={() => setFormLead(undefined)}
          onSaved={() => {
            setFormLead(undefined);
            reload();
          }}
        />
      )}

      {assignTarget && (
        <AssignLeadModal
          lead={assignTarget}
          onClose={() => setAssignTarget(null)}
          onAssigned={() => {
            setAssignTarget(null);
            reload();
          }}
        />
      )}
    </div>
  );
}
