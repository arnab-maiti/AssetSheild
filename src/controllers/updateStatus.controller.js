import { updateAssetStatusService } from "../services/updateStatus.service.js";

async function updateAssetStatusController(req, res) {
  try {
    const { id} = req.params;
    const { newStatus } = req.body;
    if(!newStatus){
        return res.status(400).json({
                success: false,
                message: "New status is required"
            });
    }
    const updatedAsset = await updateAssetStatusService(id, newStatus);
    return res.status(200).json({
      success: true,
      message: "Asset status updated successfully",
      data: updatedAsset
    });
  }catch (error) {
    console.error("Controller Error:", error.message);
   return res.status(400).json({
   success: false,
   message: error.message
});
  }
};
export { updateAssetStatusController };