import { pool } from "../config/database.js";

const SELECT_FIELDS = `
    l.id,
    l.full_name as fullName,
    l.phone_number as phoneNumber,
    l.email,
    l.departure_to as departureTo,
    l.leaving_from as leavingFrom,
    l.departure_date as departureDate,
    l.hotel_category as hotelCategory,
    l.is_flights_included as isFlightsIncluded,
    l.budget,
    l.num_of_adults as numOfAdults,
    l.num_of_infants as numOfInfants,
    l.num_of_child as numOfChild,
    l.preferred_package as preferredPackage,
    l.preferred_time_to_call as preferredTimeToCall,
    l.type_of_tour as typeOfTour,
    l.status,
    l.assigned_to as assignedTo,
    u.full_name as assignedToName,
    l.assigned_at as assignedAt,
    l.created_at as createdAt,
    l.updated_at as updatedAt
`;

const FROM_CLAUSE = `FROM leads l LEFT JOIN crm_users u ON l.assigned_to = u.id`;

export const findAll = async ({ status, assignedTo, search } = {}) => {
  const conditions = [];
  const params = [];

  if (status) {
    conditions.push("l.status = ?");
    params.push(status);
  }

  if (assignedTo === "unassigned") {
    conditions.push("l.assigned_to IS NULL");
  } else if (assignedTo) {
    conditions.push("l.assigned_to = ?");
    params.push(Number(assignedTo));
  }

  if (search) {
    conditions.push("(l.full_name LIKE ? OR l.phone_number LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [rows] = await pool.execute(
    `SELECT ${SELECT_FIELDS} ${FROM_CLAUSE} ${where} ORDER BY l.id DESC`,
    params,
  );
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT ${SELECT_FIELDS} ${FROM_CLAUSE} WHERE l.id = ? LIMIT 1`,
    [id],
  );
  return rows[0] || null;
};

export const findByEmail = async (email) => {
  const [rows] = await pool.execute(
    `SELECT ${SELECT_FIELDS} ${FROM_CLAUSE} WHERE l.email = ? LIMIT 1`,
    [email],
  );
  return rows[0] || null;
};

export const findByName = async (name) => {
  const [rows] = await pool.execute(
    `SELECT ${SELECT_FIELDS} ${FROM_CLAUSE} WHERE l.full_name = ? LIMIT 1`,
    [name],
  );
  return rows[0] || null;
};

export const createLead = async (data) => {
  const [result] = await pool.execute(
    `
    INSERT INTO leads (
      full_name, phone_number, email, departure_to, leaving_from,
      departure_date, hotel_category, is_flights_included, budget,
      num_of_adults, num_of_infants, num_of_child, preferred_package,
      preferred_time_to_call, type_of_tour
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.fullName,
      data.phoneNumber,
      data.email || null,
      data.departureTo,
      data.leavingFrom,
      data.departureDate,
      data.hotelCategory,
      data.isFlightsIncluded ? 1 : 0,
      data.budget,
      data.numOfAdults ?? null,
      data.numOfInfants ?? null,
      data.numOfChild ?? null,
      data.preferredPackage,
      data.preferredTimeToCall,
      data.typeOfTour,
    ],
  );
  return findById(result.insertId);
};

export const updateLeadById = async (data, id) => {
  await pool.execute(
    `
    UPDATE leads SET
      full_name = ?, phone_number = ?, email = ?, departure_to = ?,
      leaving_from = ?, departure_date = ?, hotel_category = ?,
      is_flights_included = ?, budget = ?, num_of_adults = ?,
      num_of_infants = ?, num_of_child = ?, preferred_package = ?,
      preferred_time_to_call = ?, type_of_tour = ?
    WHERE id = ?
    `,
    [
      data.fullName,
      data.phoneNumber,
      data.email || null,
      data.departureTo,
      data.leavingFrom,
      data.departureDate,
      data.hotelCategory,
      data.isFlightsIncluded ? 1 : 0,
      data.budget,
      data.numOfAdults ?? null,
      data.numOfInfants ?? null,
      data.numOfChild ?? null,
      data.preferredPackage,
      data.preferredTimeToCall,
      data.typeOfTour,
      id, // <-- yeh missing tha (bug fix)
    ],
  );
  return findById(id);
};

export const deleteLeadById = async (id) => {
  const [result] = await pool.execute(`DELETE FROM leads WHERE id = ?`, [id]);
  return result.affectedRows > 0;
};
