import AssetEvent from "../models/assetEvent.model.js";

async function createAssetEvent(data) {

   const event = await AssetEvent.create({

      asset_id: data.asset_id,

      event_type: data.event_type,

      performed_by: data.performed_by,

      metadata: data.metadata

   });

   return event;
}

export { createAssetEvent };