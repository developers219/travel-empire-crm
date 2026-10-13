const isPositiveInt = (value) => /^[1-9]\d*$/.test(String(value ?? "").trim());

export const checkAssignment = (body = {}) => {
  const errors = [];

  if (!isPositiveInt(body.assignedTo)) {
    errors.push({
      field: "assignedTo",
      message: "assignedTo (executive id) is required and must be a valid id",
    });
  }

  if (body.reason !== undefined && body.reason !== null) {
    if (typeof body.reason !== "string" || body.reason.trim().length > 255) {
      errors.push({
        field: "reason",
        message: "reason must be text up to 255 characters",
      });
    }
  }

  return errors;
};
