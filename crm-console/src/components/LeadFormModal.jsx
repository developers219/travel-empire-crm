import { useState } from "react";
import Modal from "./ui/Modal.jsx";
import Button from "./ui/Button.jsx";
import { createLead, updateLead } from "../api/leadsApi.js";

const EMPTY = {
  fullName: "",
  phoneNumber: "",
  email: "",
  leavingFrom: "",
  departureTo: "",
  departureDate: "",
  hotelCategory: "4 star",
  isFlightsIncluded: true,
  budget: "",
  numOfAdults: "",
  numOfChild: "",
  numOfInfants: "",
  preferredPackage: "customizable",
  preferredTimeToCall: "morning",
  typeOfTour: "family",
};

const inputClass =
  "h-10 w-full rounded-control border border-line bg-white px-3 outline-none focus:border-brand";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-semibold">{label}</span>
      {children}
    </label>
  );
}

const toNumberOrNull = (value) =>
  value === "" || value === null || value === undefined ? null : Number(value);

export default function LeadFormModal({ lead, onClose, onSaved }) {
  const isEdit = Boolean(lead);

  const [form, setForm] = useState(() =>
    isEdit
      ? {
          ...EMPTY,
          ...lead,
          email: lead.email ?? "",
          departureDate: String(lead.departureDate).slice(0, 10),
          isFlightsIncluded: Boolean(lead.isFlightsIncluded),
          numOfAdults: lead.numOfAdults ?? "",
          numOfChild: lead.numOfChild ?? "",
          numOfInfants: lead.numOfInfants ?? "",
        }
      : EMPTY,
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      fullName: form.fullName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      email: form.email.trim(),
      leavingFrom: form.leavingFrom.trim(),
      departureTo: form.departureTo.trim(),
      departureDate: form.departureDate,
      hotelCategory: form.hotelCategory,
      isFlightsIncluded: form.isFlightsIncluded,
      budget: String(form.budget).trim(),
      numOfAdults: toNumberOrNull(form.numOfAdults),
      numOfChild: toNumberOrNull(form.numOfChild),
      numOfInfants: toNumberOrNull(form.numOfInfants),
      preferredPackage: form.preferredPackage,
      preferredTimeToCall: form.preferredTimeToCall,
      typeOfTour: form.typeOfTour,
    };

    try {
      setSaving(true);
      setError("");
      if (isEdit) await updateLead(lead.id, payload);
      else await createLead(payload);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      wide
      title={isEdit ? "Edit lead" : "Add lead"}
      subtitle={
        isEdit ? `Lead #${lead.id}` : "Save every enquiry in one place."
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name *">
            <input
              required
              className={inputClass}
              value={form.fullName}
              onChange={set("fullName")}
            />
          </Field>
          <Field label="Phone *">
            <input
              required
              className={inputClass}
              value={form.phoneNumber}
              onChange={set("phoneNumber")}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={set("email")}
            />
          </Field>
          <Field label="Budget *">
            <input
              required
              className={inputClass}
              value={form.budget}
              onChange={set("budget")}
            />
          </Field>
          <Field label="Leaving from *">
            <input
              required
              className={inputClass}
              value={form.leavingFrom}
              onChange={set("leavingFrom")}
            />
          </Field>
          <Field label="Destination *">
            <input
              required
              className={inputClass}
              value={form.departureTo}
              onChange={set("departureTo")}
            />
          </Field>
          <Field label="Departure date *">
            <input
              required
              type="date"
              className={inputClass}
              value={form.departureDate}
              onChange={set("departureDate")}
            />
          </Field>
          <Field label="Hotel category">
            <select
              className={inputClass}
              value={form.hotelCategory}
              onChange={set("hotelCategory")}
            >
              <option>3 star</option>
              <option>4 star</option>
              <option>5 star</option>
            </select>
          </Field>
          <Field label="Adults">
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.numOfAdults}
              onChange={set("numOfAdults")}
            />
          </Field>
          <Field label="Children">
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.numOfChild}
              onChange={set("numOfChild")}
            />
          </Field>
          <Field label="Infants">
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.numOfInfants}
              onChange={set("numOfInfants")}
            />
          </Field>
          <Field label="Type of tour">
            <select
              className={inputClass}
              value={form.typeOfTour}
              onChange={set("typeOfTour")}
            >
              <option value="honeymoon">Honeymoon</option>
              <option value="family">Family</option>
              <option value="friends">Friends</option>
              <option value="solo">Solo</option>
            </select>
          </Field>
          <Field label="Preferred package">
            <select
              className={inputClass}
              value={form.preferredPackage}
              onChange={set("preferredPackage")}
            >
              <option value="customizable">Customizable</option>
              <option value="bestselling">Best selling</option>
            </select>
          </Field>
          <Field label="Best time to call">
            <select
              className={inputClass}
              value={form.preferredTimeToCall}
              onChange={set("preferredTimeToCall")}
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </Field>
        </div>

        <label className="mt-4 flex items-center gap-2 text-[14px]">
          <input
            type="checkbox"
            checked={form.isFlightsIncluded}
            onChange={(e) =>
              setForm({ ...form, isFlightsIncluded: e.target.checked })
            }
          />
          Flights included
        </label>

        {error && (
          <p className="mt-4 rounded-control border border-danger/30 bg-danger/5 p-3 text-[13px] text-danger">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Save changes" : "Save lead"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
