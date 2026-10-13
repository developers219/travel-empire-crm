import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const userRouter = Router();

userRouter.get(
  "/executives",
  authenticate,
  authorize("admin", "sales_manager"),
  userController.getActiveExecutives,
);

export default userRouter;
