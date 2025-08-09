import { poolClient } from "./connect_db.js";

export default async function init() {
  const sql = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );`;
  const client = await poolClient.connect();
  try {
    await client.query(sql);
    console.log("Auth DB initialized");
  } finally {
    client.release();
  }
}
