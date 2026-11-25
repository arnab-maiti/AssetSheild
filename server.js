import app from "./src/app.js";
import sequelize from "./src/config/db.js";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
    try {
        await sequelize.authenticate();

        console.log("Database connected successfully");

        const server = app.listen(PORT, () => {
            console.log(`AssetShield API running on port ${PORT}`);
        });

        const shutdown = async (signal) => {
            console.log(`${signal} received. Shutting down...`);

            server.close(async () => {
                try {
                    await sequelize.close();
                    console.log("Database connection closed");
                    process.exit(0);
                } catch (error) {
                    console.error("Shutdown error:", error.message);
                    process.exit(1);
                }
            });
        };

        process.on("SIGINT", () => shutdown("SIGINT"));
        process.on("SIGTERM", () => shutdown("SIGTERM"));

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();