import express from "express";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes/index.js";
import { allowedOrigins } from "./config/origins.js";
import { AppError } from "./utils/AppError.js";
import { generalLimiter } from "./middlewares/rateLimiters.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Désactive l'en-tête qui révèle l'utilisation d'Express.
app.disable("x-powered-by");

// Configure le nombre de proxies de confiance (utile en production).
const proxyHops = Number(process.env.TRUST_PROXY) || 0;
if (proxyHops > 0) app.set("trust proxy", proxyHops);

// Ajoute les en-têtes HTTP de sécurité avec Helmet.
app.use(helmet());

// Configure CORS pour autoriser uniquement les origines définies dans la liste blanche.
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new AppError(403, "CORS_FORBIDDEN", "Origine non autorisée."));
    },
    methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes HTTP autorisées.
    allowedHeaders: ["Content-Type", "Authorization"], // Headers autorisés.
    maxAge: 600, // Durée de mise en cache des réponses preflight (10 minutes).
  })
);

// Applique la limitation générale des requêtes à toutes les routes /api.
app.use("/api", generalLimiter);

// Permet à Express de lire les données JSON (maximum 10 Ko).
app.use(express.json({ limit: "10kb" }));

// Connecte toutes les routes de l'API sous le préfixe /api.
app.use("/api", routes);

// Gère les routes qui n'existent pas.
app.use(notFound);

// Centralise la gestion des erreurs de l'application.
app.use(errorHandler);

export default app;