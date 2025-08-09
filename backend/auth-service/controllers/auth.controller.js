// backend/auth-service/controllers/auth.controller.js

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { database } from "../database/connect_db.js";
import { users } from "../database/models/user.model.js";
import { eq } from "drizzle-orm";
import { JWT_SECRET } from "../config/env.js";

//Todo : check if the email already exists
export const registerUser = async (req, res) => {
  const { email, password, role = "ADMIN", name } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email+password required" });

  try {
    const existingUser = await database
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await database
      .insert(users)
      .values({
        email,
        password: hashed,
        role,
        name,
      })
      .returning();
    const created = result[0];

    res.json({
      id: created.id,
      email: created.email,
      role: created.role,
      name: created.name,
    });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ error: "could not create user (maybe email exists)" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email+password required" });

  const rows = await database
    .select()
    .from(users)
    .where(eq(users.email, email));
  const user = rows[0];
  if (!user) return res.status(401).json({ error: "invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "invalid credentials" });

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role, name: user.name },
  });
};

export const getProfile = async (req, res) => {
  const auth = req.headers.authorization?.split(" ")[1];
  if (!auth) return res.status(401).json({ error: "no token" });
  try {
    const decoded = jwt.verify(auth, JWT_SECRET);
    res.json(decoded);
  } catch (err) {
    res.status(401).json({ error: "invalid token" });
  }
};
