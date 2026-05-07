import express from "express";
import { verifyAssetData } from "../controllers/verify.controller.js";

const router = express.Router();

router.get("/:tokenId", verifyAssetData);

export default router;
