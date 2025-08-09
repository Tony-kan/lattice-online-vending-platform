// backend/billing-service/controllers/sales.controller.js

import { poolClient } from "../database/connect_db.js";
import { v4 as uuidv4 } from "uuid";
import { database } from "../database/connect_db.js";
import { sales } from "../database/models/sales.model.js";
import { sale_items } from "../database/models/sale_items.model.js";
import { eq } from "drizzle-orm";

// Create sale (transactional: insert sale, sale_items, deduct inventory)
export const createSale = async (req, res) => {
  /**
   * expected body:
   * { items: [{ item_id, quantity }], tax: 0.18 (optional), discount: 0.05 (optional) }
   */
  const { items: saleItems = [], tax = 0, discount = 0 } = req.body;
  if (!Array.isArray(saleItems) || saleItems.length === 0)
    return res.status(400).json({ error: "no items" });

  const client = await poolClient.connect();
  try {
    await client.query("BEGIN");

    // fetch items and calculate totals
    const ids = saleItems.map((it) => it.item_id);
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");
    const { rows } = await client.query(
      `SELECT id, price, stock, name FROM items WHERE id IN (${placeholders})`,
      ids
    );
    // simple lookup
    const map = new Map(rows.map((r) => [r.id, r]));

    let subtotal = 0;
    for (const si of saleItems) {
      const row = map.get(si.item_id);
      if (!row) throw new Error(`item ${si.item_id} not found`);
      if (row.stock < si.quantity)
        throw new Error(`insufficient stock for item ${si.item_id}`);
      subtotal += Number(row.price) * Number(si.quantity);
    }

    const taxAmount = Number(subtotal) * Number(tax || 0);
    const discountAmount = Number(subtotal) * Number(discount || 0);
    const total = subtotal + taxAmount - discountAmount;

    // insert sale
    const receipt = `RCPT-${uuidv4().slice(0, 8)}`;
    const saleResult = await client.query(
      `INSERT INTO sales (receipt, total, tax, discount) VALUES ($1,$2,$3,$4) RETURNING id, receipt, total`,
      [receipt, total, taxAmount, discountAmount]
    );
    const saleId = saleResult.rows[0].id;

    // insert sale_items and deduct stock
    for (const si of saleItems) {
      const row = map.get(si.item_id);
      await client.query(
        `INSERT INTO sale_items (sale_id, item_id, price, quantity) VALUES ($1,$2,$3,$4)`,
        [saleId, si.item_id, row.price, si.quantity]
      );
      // deduct stock
      await client.query(`UPDATE items SET stock = stock - $1 WHERE id = $2`, [
        si.quantity,
        si.item_id,
      ]);
    }

    await client.query("COMMIT");
    res.json({ saleId, receipt, total });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
};

//get receipt

export const getReceipt = async (req, res) => {
  const { receipt } = req.params;
  const sale = await database
    .select()
    .from(sales)
    .where(eq(sales.receipt, receipt));
  if (sale.length === 0) return res.status(404).json({ error: "not found" });

  const saleId = sale[0].id;
  const itemsRows = await database
    .select()
    .from(sale_items)
    .where(eq(sale_items.sale_id, saleId));
  res.json({ sale: sale[0], items: itemsRows });
};
