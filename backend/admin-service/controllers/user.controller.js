// backend/admin-service/controllers/user.controller.js

import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import { database } from "../database/connect_db.js";
import { users } from "../database/models/user.model.js";
import { eq } from "drizzle-orm";

// list users (admin only)
export const getAllUsers = async (req, res) => {
  const rows = await database.select().from(users);
  res.json(rows);
};

// create user (admin)
export const addUser = async (req, res) => {
  const {
    email,
    password = "changeme",
    role = "BILLING_CLERK",
    name,
  } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const result = await database
      .insert(users)
      .values({ email, password: hashed, role, name })
      .returning();
    res.json(result[0]);
  } catch (err) {
    res.status(400).json({ error: "could not create" });
  }
};

// update user (admin)
export const updateUserDetails = async (req, res) => {
  const id = Number(req.params.id);
  const { email, role, name } = req.body;
  await database
    .update(users)
    .set({ email, role, name })
    .where(eq(users.id, id));
  const updated = await database.select().from(users).where(eq(users.id, id));
  res.json(updated[0]);
};

// delete user (admin)
export const deleteUser = async (req, res) => {
  const id = Number(req.params.id);
  await database.delete(users).where(eq(users.id, id));
  res.json({ ok: true });
};
