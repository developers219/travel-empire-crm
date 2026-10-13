import { useEffect, useState } from "react";
import Modal from "./ui/Modal.jsx";
import Button from "./ui/Button.jsx";
import { assignLead, getAssignmentHistory } from "../api/leadsApi.js";
import { getExecutives } from "../api/usersApi.js";

const formatDateTime = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AssignLeadModal({ lead, onClose, onAssigned }) {
  const [executives, setExecutives] = useState([]);
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(lead.assignedTo ?? null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [execs, hist] = await Promise.all([
          getExecutives(),
          getAssignmentHistory(lead.id),
        ]);
        setExecutives(execs);
        setHistory(hist);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lead.id]);

  const handleAssign = async () => {
    try {
      setSaving(true);
      setError("");
      await assignLead(lead.id, selected, reason.trim() || undefined);
      onAssigned();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const unchanged = selected === lead.assignedTo;

  return (
    <Modal
      title={lead.assignedTo ? "Reassign lead" : "Assign lead"}
      subtitle={`${lead.fullName} · Lead #${lead.id}`}
      onClose={onClose}
    >
      <p className="mb-3 text-[13px] text-muted">
        Only active sales executives are shown.
      </p>

      {loading && <p className="text-muted">Loading...</p>}

      <div className="space-y-2">
        {executives.map((exec) => (
          <label
            key={exec.id}
            className={`flex cursor-pointer items-center gap-3 rounded-control border p-3 ${
              selected === exec.id
                ? "border-brand bg-brand-tint/40"
                : "border-line"
            }`}
          >
            <input
              type="radio"
              name="executive"
              checked={selected === exec.id}
              onChange={() => setSelected(exec.id)}
            />
            <div className="flex-1">
              <p className="font-semibold leading-tight">{exec.fullName}</p>
              <p className="text-[13px] text-muted">{exec.email}</p>
            </div>
            {lead.assignedTo === exec.id && (
              <span className="text-[13px] text-muted">Current</span>
            )}
          </label>
        ))}
      </div>

      <label className="mt-4 block">
        <span className="mb-1 block text-[13px] font-semibold">
          Reason (optional)
        </span>
        <textarea
          maxLength={255}
          rows={2}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full rounded-control border border-line p-3 outline-none focus:border-brand"
        />
      </label>

      {history.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[13px] font-semibold">Assignment history</p>
          <ul className="space-y-1 text-[13px] text-muted">
            {history.map((h) => (
              <li key={h.id}>
                {formatDateTime(h.createdAt)} · {h.assignedByName} →{" "}
                <span className="font-semibold text-body">
                  {h.assignedToName}
                </span>
                {h.reason ? ` (${h.reason})` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-control border border-danger/30 bg-danger/5 p-3 text-[13px] text-danger">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleAssign}
          disabled={!selected || unchanged || saving}
        >
          {saving ? "Assigning..." : "Assign lead"}
        </Button>
      </div>
    </Modal>
  );
}
