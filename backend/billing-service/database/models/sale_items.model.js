import {
  pgTable,
  serial,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sales } from "./sales.model.js";
import { items } from "../../../inventory-service/database/models/item.model.js";

export const saleItems = pgTable("sale_items", {
  id: serial("id").primaryKey(),
  sale_id: integer("sale_id").notNull(),
  item_id: integer("item_id").notNull(),
  price: numeric("price").notNull(),
  quantity: integer("quantity").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const saleItemsRelations = relations(saleItems, ({ one }) => ({
  // A saleItem belongs to 'one' sale.
  // This helps Drizzle understand the join condition.
  sale: one(sales, {
    fields: [saleItems.sale_id],
    references: [sales.id],
  }),
  // A saleItem also corresponds to 'one' item from inventory.
  item: one(items, {
    fields: [saleItems.item_id],
    references: [items.id],
  }),
}));
