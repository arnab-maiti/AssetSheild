import express from "express";

import sequelize from "./config/db.js";

import "./models/asset.model.js";
import "./models/assetEvent.model.js";

import assetRoutes from "./routes/asset.routes.js";
import verifyRoutes from "./routes/verify.routes.js";
import updateStatusRoutes from "./routes/updateStatus.routes.js";

const app = express();

app.use(express.json());

app.use("/api/assets", assetRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/assets", updateStatusRoutes);

await sequelize.sync();

export default app;