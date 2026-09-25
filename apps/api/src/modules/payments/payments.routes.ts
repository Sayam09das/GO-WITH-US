import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { paymentsController } from "./payments.controller.js";

const paymentsRouter = Router();

paymentsRouter.post("/create", requireAuth, paymentsController.createPayment);
paymentsRouter.post("/webhook", paymentsController.webhook);

export { paymentsRouter };
