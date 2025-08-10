import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { saleItems } from "./sale_items.model.js";

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  receipt: text("receipt").notNull(),
  total: numeric("total").notNull(),
  tax: numeric("tax"),
  discount: numeric("discount"),
  created_at: timestamp("created_at").defaultNow(),
});

export const salesRelations = relations(sales, ({ many }) => ({
  // A sale can have 'many' saleItems. We name this relation 'saleItems'.
  // This is what populates `database.query.sales.with.saleItems`
  saleItems: many(saleItems),
}));
