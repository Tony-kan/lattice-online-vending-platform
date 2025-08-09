// backend/admin-service/routes/user.routes.js

import { Router } from "express";
import {
  getAllUsers,
  addUser,
  updateUserDetails,
  deleteUser,
} from "../controllers/user.controller.js";
import { requireRoles } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/users", requireRoles("ADMIN"), getAllUsers);

userRouter.post("/users", requireRoles("ADMIN"), addUser);

userRouter.put("/users/:id", requireRoles("ADMIN"), updateUserDetails);

userRouter.delete("/users/:id", requireRoles("ADMIN"), deleteUser);

export default userRouter;
