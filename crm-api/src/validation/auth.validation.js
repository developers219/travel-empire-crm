export const checkLogin = (body = {}) => {
  const errors = [];

  if (!String(body.email ?? "").trim()) {
    errors.push({ field: "email", message: "Email is required" });
  }
  if (!String(body.password ?? "")) {
    errors.push({ field: "password", message: "Password is required" });
  }

  return errors;
};
