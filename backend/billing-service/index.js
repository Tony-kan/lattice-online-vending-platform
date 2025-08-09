// backend/billing-service/index.js

//Todo: add api versioning & bumping up package.json versions

import express from "express";
import initDb from "./database/init_db.js";
import cors from "cors";
import { PORT } from "./config/env.js";
import salesRouter from "./routes/sales.routes.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

app.use("/billing", salesRouter);

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Billing service running on ${PORT}`);
  });
});
