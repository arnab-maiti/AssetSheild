import express from "express";
import { createAsset } from "../controllers/asset.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("file"), createAsset);

export default router;
