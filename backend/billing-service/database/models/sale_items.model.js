import {
  pgTable,
  serial,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

export const sale_items = pgTable("sale_items", {
  id: serial("id").primaryKey(),
  sale_id: integer("sale_id").notNull(),
  item_id: integer("item_id").notNull(),
  price: numeric("price").notNull(),
  quantity: integer("quantity").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
