import Asset from "../models/asset.model.js";

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

   asset.status = newStatus;

   await asset.save();

   return asset;
}

export { updateAssetStatusService };