// backend/auth-service/index.js

//Todo: add api versioning & bumping up package.json versions

import express from "express";
import initDb from "./database/init_db.js";
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";

const app = express();
app.use(express.json());

app.use("/auth", authRouter);

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Auth service running on ${PORT}`);
  });
});
