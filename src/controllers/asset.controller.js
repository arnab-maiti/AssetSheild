import { createAssetService } from "../services/asset.service.js";
import { isAddress } from "ethers";

async function createAsset(req, res) {
    const file = req.file;
    const data = req.body;

    if (!file) {
        return res.status(400).json({
            success: false,
            message: "File is required"
        });
    }

    if (!data.title?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Title is required"
        });
    }

    if (!data.walletAddress) {
        return res.status(400).json({
            success: false,
            message: "Wallet address is required"
        });
    }

    if (!isAddress(data.walletAddress)) {
        return res.status(400).json({
            success: false,
            message: "Valid wallet address is required"
        });
    }

    const asset = await createAssetService(file, data);

    return res.status(201).json({
        success: true,
        data: asset
    });
}

export { createAsset };