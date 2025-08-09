import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DATABASE_URL } from "../config/env.js";

export const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const database = drizzle(pool);

export const poolClient = pool;
