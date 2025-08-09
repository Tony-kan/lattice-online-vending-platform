// backend/inventory-service/controllers/item .controller.js

import { database } from "../database/connect_db.js";
import { items } from "../database/models/item.model.js";
import { eq } from "drizzle-orm";

// GET list
export const getAllItems = async (req, res) => {
  const rows = await database.select().from(items);
  res.json(rows);
};

// GET low stock
export const getLowStockItems = async (req, res) => {
  const threshold = parseInt(req.query.threshold || "5", 10);
  const rows = await database
    .select()
    .from(items)
    .where(sql`${items.stock} < ${threshold}`);
  res.json(rows);
};

// Add item
export const AddNewItem = async (req, res) => {
  const { name, sku, price, stock } = req.body;
  const result = await database
    .insert(items)
    .values({ name, sku, price, stock })
    .returning();
  res.json(result[0]);
};

// Update item
export const updateItemDetails = async (req, res) => {
  const id = Number(req.params.id);
  const { name, sku, price, stock } = req.body;
  await database
    .update(items)
    .set({ name, sku, price, stock })
    .where(eq(items.id, id));
  const updated = await database.select().from(items).where(eq(items.id, id));
  res.json(updated[0]);
};

// Delete
export const deleteItem = async (req, res) => {
  const id = Number(req.params.id);
  await database.delete(items).where(eq(items.id, id));
  res.json({ ok: true });
};

// Get single
export const getItemById = async (req, res) => {
  const id = Number(req.params.id);
  const row = await database.select().from(items).where(eq(items.id, id));
  res.json(row[0] || null);
};
