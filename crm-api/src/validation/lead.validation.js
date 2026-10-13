export const checkLead = (body = {}) => {
  const errors = [];

  const phone = String(body.phoneNumber ?? "").trim();
  let phoneRegEx = /^[0-9+\-\s()]{7,20}$/;
  if (!phone) {
    errors.push({
      field: "Phone Number",
      message: "Phone Number is required",
    });
  } else if (!phoneRegEx.test(phone)) {
    errors.push({
      field: "Phone Number",
      message: "Invalid phone number",
    });
  }

  const email = String(body.email ?? "").trim();
  let emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (email && !emailRegEx.test(email)) {
    errors.push({
      field: "email",
      message: "Invalid email",
    });
  }

  return errors;
};
