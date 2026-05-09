import { DataTypes } from "sequelize";

import sequelize from "../config/db.js";

const AssetEvent = sequelize.define(
   "AssetEvent",
   {

      id: {
         type: DataTypes.UUID,
         defaultValue: DataTypes.UUIDV4,
         primaryKey: true,
      },

      asset_id: {
         type: DataTypes.UUID,
         allowNull: false,
      },

      event_type: {
         type: DataTypes.STRING,
         allowNull: false,
      },

      performed_by: {
         type: DataTypes.UUID,
         allowNull: false,
      },

      metadata: {
         type: DataTypes.JSONB,
         allowNull: true,
      },

      created_at: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW,
      }

   },
   {
      tableName: "asset_events",
      timestamps: false,
   }
);

export default AssetEvent;