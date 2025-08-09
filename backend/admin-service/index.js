// backend/admin-service/index.js

//Todo: add api versioning & bumping up package.json versions

import express from "express";
import initDb from "./database/init_db.js";
import cors from "cors";
import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

app.use("/admin", userRouter);

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Admin service running on ${PORT}`);
  });
});
