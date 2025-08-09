// backend/auth-service/index.js

//Todo: add api versioning & bumping up package.json versions

import express from "express";
import initDb from "./database/init_db.js";
import cors from "cors";
import { PORT } from "./config/env.js";
import itemRouter from "./routes/item.routes.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

app.use("/inventory", itemRouter);

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Auth service running on ${PORT}`);
  });
});
