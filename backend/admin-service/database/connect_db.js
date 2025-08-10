import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DATABASE_URL } from "../config/env.js";
import * as usersSchema from "./models/user.model.js";

export const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const database = drizzle(pool, {
  schema: { ...usersSchema },
});

export const poolClient = pool;
