import dotenv from "dotenv";
import app from "./app";
import prisma from "./shared/config/prisma";

dotenv.config({ path: "./.env" });
console.log("ENV KEY:", process.env.OPENROUTER_API_KEY);

const PORT = 8000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Database 🥰connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database", error);
    process.exit(1);
  }
}

startServer();