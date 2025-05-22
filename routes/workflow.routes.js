
import { Router } from "express";
import { sendReminder } from "../controllers/workflow.controller.js";

const workflowRouter = Router();

workflowRouter.get('/', sendReminder);

export default workflowRouter;