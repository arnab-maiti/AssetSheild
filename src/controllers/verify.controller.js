import { verifyAssetService } from "../services/verify.service.js";

async function verifyAssetData(req,res) {
    const { tokenId } = req.params;

    if (!tokenId || !/^\d+$/.test(tokenId)) {
        return res.status(400).json({
            success: false,
            message: "Valid tokenId is required"
        });
    }

    try{
        const verificationResult = await verifyAssetService(tokenId);
        return res.status(200).json({
            success: true,
            data: verificationResult
        });
    } catch (error) {
        const statusCode = error.message === "asset is not accessable" ? 404 : 400;

        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
}
export { verifyAssetData };
