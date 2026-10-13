import * as authService from "../services/auth.service.js";
import AppError from "../utils/appError.js";

export const login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    console.error("Error in login: ", error);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

export const me = (req, res) => {
  return res.status(200).json({ success: true, data: req.user });
};
