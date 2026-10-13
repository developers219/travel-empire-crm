import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { checkLogin } from "../validation/auth.validation.js";

const authRouter = Router();

authRouter.post("/login", validate(checkLogin), authController.login);
authRouter.get("/me", authenticate, authController.me);

export default authRouter;
