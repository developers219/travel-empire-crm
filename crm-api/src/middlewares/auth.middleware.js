import jwt from "jsonwebtoken";
import * as userRepository from "../repositories/user.repository.js";

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res
        .status(401)
        .json({ success: false, message: "Login required" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userRepository.findById(payload.sub);
    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "Account not active" });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
