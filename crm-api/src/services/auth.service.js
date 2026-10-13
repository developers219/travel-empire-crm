import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import * as userRepository from "../repositories/user.repository.js";

export const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email.trim().toLowerCase());

  const passwordOk = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;
  if (!passwordOk) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("Your CRM access is disabled. Contact the Admin.", 403);
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
  });

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
};
