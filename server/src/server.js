import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { checkEnv } from "./config/checkEnv.js";

const PORT = process.env.PORT || 3000;

try {
  checkEnv();
  await connectDB();
  app.listen(PORT, () => {
    console.log(`API démarrée sur http://localhost:${PORT}`);
  });
} catch (err) {
  console.error("Démarrage impossible :", err.message);
  process.exit(1);
}