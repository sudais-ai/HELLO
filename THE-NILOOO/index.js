const { client, config } = require("./lib");
const express = require("express");
const app = express();

const startBot = async () => {
  try {
    console.log("🚀 Launching THE-LEGENDARY-N1L-BOT...");

    // Sync database if Sequelize instance
    if (config && config.DATABASE && typeof config.DATABASE.sync === "function") {
      await config.DATABASE.sync();
      console.log("📦 Database synced successfully!");
    } else {
      console.warn("⚠ No DATABASE sync found — skipping DB connection.");
    }

    // Start bot
    const ClientInstance = new client();
    if (ClientInstance.startServer) await ClientInstance.startServer();
    if (ClientInstance.WriteSession) await ClientInstance.WriteSession();
    if (ClientInstance.WaConnect) await ClientInstance.WaConnect();

    console.log("✅ Bot started successfully!");

    // ✅ Keep server alive with Express on port 3000
    app.get("/", (_, res) => res.send("🟢 Legendary N1L Bot is Alive!"));
    app.listen(3000, '0.0.0.0', () => console.log("🌐 Server Running on port 3000..."));

  } catch (error) {
    console.error("❌ Bot Startup Error:", error.message || error);
  }
};

startBot();
