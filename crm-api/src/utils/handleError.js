import AppError from "./appError.js";

export const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

export const sendError = (res, error, fallbackMessage) => {
  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json({ success: false, message: error.message });
  }
  console.error(`${fallbackMessage}: `, error);
  return res.status(500).json({ success: false, message: fallbackMessage });
};
