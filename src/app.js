import express from "express";

import "./models/asset.model.js";
import "./models/assetEvent.model.js";

import assetRoutes from "./routes/asset.routes.js";
import verifyRoutes from "./routes/verify.routes.js";
import updateStatusRoutes from "./routes/updateStatus.routes.js";

import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.disable("x-powered-by");

app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
        service: "AssetShield API",
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use("/api/assets", assetRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/assets", updateStatusRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

// Centralized error handler
app.use(errorHandler);

export default app;