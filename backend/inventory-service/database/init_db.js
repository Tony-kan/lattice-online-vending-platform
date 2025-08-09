import { poolClient } from "./connect_db.js";

export default async function init() {
  const sql = `
  CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    sku TEXT NOT NULL,
    price NUMERIC NOT NULL,
    stock INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );`;
  const client = await poolClient.connect();
  try {
    await client.query(sql);
    console.log("Auth DB initialized");
  } finally {
    client.release();
  }
}
