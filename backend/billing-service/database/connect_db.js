import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DATABASE_URL } from "../config/env.js";
import * as salesSchema from "./models/sales.model.js";
import * as saleItemsSchema from "./models/sale_items.model.js";
import * as itemsSchema from "../../inventory-service/database/models/item.model.js";

export const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const database = drizzle(pool, {
  schema: { ...salesSchema, ...saleItemsSchema, ...itemsSchema },
});

export const poolClient = pool;
