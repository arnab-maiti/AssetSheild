import express from "express";
import assetRoutes from "./routes/asset.routes.js";
import verifyRoutes from "./routes/verify.routes.js";
const app = express();

app.use(express.json());

app.use("/api/assets", assetRoutes);
app.use("/api/verify", verifyRoutes);
export default app;
