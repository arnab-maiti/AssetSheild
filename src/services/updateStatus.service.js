import Asset from "../models/asset.model.js";
import { createAssetEvent } from "./event.service.js";
import {
  allowedStatuses,
  allowedTransitions
} from "../utils/status.js";

async function updateAssetStatusService(id, newStatus) {

   if (!allowedStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
   }

   const asset = await Asset.findByPk(id);

   if (!asset) {
      throw new Error("Asset not found");
   }

   const currentStatus = asset.status;

   const possibleTransitions =
      allowedTransitions[currentStatus] || [];

   if (!possibleTransitions.includes(newStatus)) {
      throw new Error(
         `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
   }
   const oldStatus = asset.status;
   asset.status = newStatus;

   await asset.save();
   await createAssetEvent({

   asset_id: asset.id,

   event_type: "status_updated",

   performed_by: asset.issued_by,

   metadata: {
      old_status: oldStatus,
      new_status: newStatus
   }

});
   return asset;
}

export { updateAssetStatusService };