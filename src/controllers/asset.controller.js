import { createAssetService } from "../services/asset.service.js";
import { isAddress } from "ethers";
 
async function createAsset(req,res) {
    try{
    const file = req.file;
    const data = req.body;
    if(!file){
        return res.status(400).json({
                success: false,
                message: "File is required"
            });
    }
    if(!data.title){
        return res.status(400).json({
                success: false,
                message: "Title is required"
            });
    }
    if(!data.walletAddress){
        return res.status(400).json({
                success: false,
                message: "Wallet address required"
            });
    }
    if(!isAddress(data.walletAddress)){
        return res.status(400).json({
                success: false,
                message: "Valid wallet address required"
            });
    }
     const asset = await createAssetService(file, data);
      return res.status(201).json({
            success: true,
            data: asset
        });
    }
          catch (error) {
        console.error("Controller Error:", error.message);

        if (error.name === "DuplicateAssetError" || error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
                success: false,
                message: "Asset already exists",
                error: "A document with this hash has already been uploaded"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Asset creation failed",
            error: error.message
        });
    }
}

export { createAsset };
