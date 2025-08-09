// backend/billing-service/routes/sales.routes.js

import { Router } from "express";
import { createSale, getReceipt } from "../controllers/sales.controller.js";
import { requireRoles } from "../middlewares/auth.middleware.js";

const salesRouter = Router();

salesRouter.post("/sales", requireRoles("BILLING_CLERK"), createSale);

salesRouter.get(
  "/receipts/:receipt",
  requireRoles("BILLING_CLERK", "ADMIN"),
  getReceipt
);

export default salesRouter;
