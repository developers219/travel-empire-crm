import { Router } from "express";
import * as leadController from "../controllers/lead.controller.js";
import * as assignmentController from "../controllers/assignment.controller.js";
import { checkAssignment } from "../validation/assignment.validation.js";
import { validate } from "../middlewares/validation.middleware.js";
import { checkLead } from "../validation/lead.validation.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const leadRouter = Router();

const MANAGERS = ["admin", "sales_manager"];

leadRouter.use(authenticate);

leadRouter.get("/", leadController.getAllLeads);
leadRouter.get(
  "/by-email/:email",
  authorize(...MANAGERS),
  leadController.getLeadByEmail,
);
leadRouter.get(
  "/by-name/:name",
  authorize(...MANAGERS),
  leadController.getLeadByName,
);
leadRouter.get("/:id", leadController.getLeadById);

leadRouter.post(
  "/",
  authorize(...MANAGERS),
  validate(checkLead),
  leadController.createLead,
);
leadRouter.put("/:id", validate(checkLead), leadController.updateLeadById);
leadRouter.delete("/:id", authorize("admin"), leadController.deleteLeadById);

leadRouter.post(
  "/:id/assign",
  authorize(...MANAGERS),
  validate(checkAssignment),
  assignmentController.assignLead,
);
leadRouter.get(
  "/:id/assignments",
  authorize(...MANAGERS),
  assignmentController.getAssignmentHistory,
);

export default leadRouter;
