import express from "express";
import assetRoutes from "./routes/asset.routes.js";

const app = express();

app.use(express.json());

app.use("/api/assets", assetRoutes);

export default app;
