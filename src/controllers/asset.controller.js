import { createAssetService } from "../services/asset.service.js";
 
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
    if(!data.walletAddress){
        return res.status(400).json({
                success: false,
                message: "Wallet address required"
            });
    }
    console.log("BODY:", req.body);
     const asset = await createAssetService(file, data);
      return res.status(201).json({
            success: true,
            data: asset
        });
    }
          catch (error) {
        console.error("Controller Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Asset creation failed",
            error: error.message
        });
    }
}

export { createAsset };
