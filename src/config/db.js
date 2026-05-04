import "dotenv/config";
import { Sequelize } from "sequelize";

if (!process.env.DB_URL) {
    throw new Error("DB_URL is required in the environment");
}

const sequelize = new Sequelize(process.env.DB_URL);

export default sequelize;
