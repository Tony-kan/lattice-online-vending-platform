import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { authMiddleware } from "./middlewares/auth.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 8080;

//security headers
app.use(helmet());

// Apply rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
});
app.use("/api/", apiLimiter);
// app.use("/api", authMiddleware);

const serviceRegistry = {
  adminService: "http://localhost:4003",
  inventoryService: "http://localhost:4001",
  billingService: "http://localhost:4002",
  authService: "http://localhost:4000",
};

const authServiceProxy = createProxyMiddleware({
  target: serviceRegistry.authService,
  changeOrigin: true,
  pathRewrite: { "^/api/auth": "/auth" },
});

const adminServiceProxy = createProxyMiddleware({
  target: serviceRegistry.adminService,
  changeOrigin: true,
  pathRewrite: { "^/api/admin": "/admin" },
});

const inventoryServiceProxy = createProxyMiddleware({
  target: serviceRegistry.inventoryService,
  changeOrigin: true,
  pathRewrite: { "^/api/inventory": "/inventory" },
});

const billingServiceProxy = createProxyMiddleware({
  target: serviceRegistry.billingService,
  changeOrigin: true,
  pathRewrite: { "^/api/billing": "/billing" },
});

// Route requests to appropriate services
app.use("/api/admin", authMiddleware, adminServiceProxy);
app.use("/api/auth", authServiceProxy);
app.use("/api/billing", authMiddleware, billingServiceProxy);
app.use("/api/inventory", authMiddleware, inventoryServiceProxy);

app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
