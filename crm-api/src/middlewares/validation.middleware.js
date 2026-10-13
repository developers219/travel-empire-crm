export const validate = (checker) => (req, res, next) => {
  const errors = checker(req.body);
  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }
  return next();
};
