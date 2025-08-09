import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core";

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  receipt: text("receipt").notNull(),
  total: numeric("total").notNull(),
  tax: numeric("tax"),
  discount: numeric("discount"),
  created_at: timestamp("created_at").defaultNow(),
});
