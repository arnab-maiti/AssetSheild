import sequelize from "./config/db.js";
import Asset from "./models/asset.model.js";

async function ensureAssetColumns() {
    const queryInterface = sequelize.getQueryInterface();
    const columns = await queryInterface.describeTable("assets").catch(() => null);

    if (!columns) {
        return;
    }

    const attributes = Asset.getAttributes();
    const optionalColumns = ["metadata_uri", "token_id", "tx_hash"];

    for (const columnName of optionalColumns) {
        if (!columns[columnName]) {
            await queryInterface.addColumn("assets", columnName, attributes[columnName]);
        }
    }
}

try {
    await sequelize.sync();
    await ensureAssetColumns();
    console.log("DB connected");
} catch (error) {
    console.error("DB connection failed:", error.message);
    process.exitCode = 1;
}
