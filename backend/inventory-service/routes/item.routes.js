// backend/inventory-service/routes/item.routes.js

import { Router } from "express";
import {
  getAllItems,
  getLowStockItems,
  AddNewItem,
  deleteItem,
  updateItemDetails,
  getItemById,
} from "../controllers/item.controller.js";
import { requireRoles } from "../middlewares/auth.middleware.js";

const itemRouter = Router();

itemRouter.get(
  "/items",
  requireRoles("INVENTORY_MANAGER", "BILLING_CLERK", "HR_OFFICER"),
  getAllItems
);

itemRouter.get(
  "/items/low",
  requireRoles("INVENTORY_MANAGER", "ADMIN"),
  getLowStockItems
);

itemRouter.post("/items", requireRoles("INVENTORY_MANAGER"), AddNewItem);

itemRouter.put(
  "/items/:id",
  requireRoles("INVENTORY_MANAGER"),
  updateItemDetails
);

itemRouter.delete("/items/:id", requireRoles("INVENTORY_MANAGER"), deleteItem);

itemRouter.get(
  "/items/:id",
  requireRoles("INVENTORY_MANAGER", "BILLING_CLERK"),
  getItemById
);

export default itemRouter;
