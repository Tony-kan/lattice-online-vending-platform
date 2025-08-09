// backend/auth-service/routes/auth.routes.js

import { Router } from "express";
import {
  registerUser,
  login,
  getProfile,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerUser);

authRouter.post("/login", login);

authRouter.get("/profile", getProfile);

export default authRouter;
