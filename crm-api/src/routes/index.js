import { Router } from "express";
import authRouter from "../routes/auth.routes.js";
import leadRouter from "../routes/lead.routes.js";
import userRouter from "../routes/user.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/leads", leadRouter);
apiRouter.use("/users", userRouter);

export default apiRouter;
