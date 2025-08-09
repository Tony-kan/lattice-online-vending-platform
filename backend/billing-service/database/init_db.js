import { poolClient } from "./connect_db.js";

export default async function init() {
  const client = await poolClient.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        receipt TEXT NOT NULL,
        total NUMERIC NOT NULL,
        tax NUMERIC,
        discount NUMERIC,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS sale_items (
        id SERIAL PRIMARY KEY,
        sale_id INTEGER NOT NULL REFERENCES sales(id),
        item_id INTEGER NOT NULL,
        price NUMERIC NOT NULL,
        quantity INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Billing DB initialized");
  } finally {
    client.release();
  }
}
