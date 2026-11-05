import express from "express";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.disable("x-powered-by"); //supprimer l'annonce express, c’est un premier geste de sécurité.
app.use(express.json({ limit: "10kb" })); //est un middleware qui lit le JSON envoyé par le client et le place dans req.body

app.use("/api", routes); //Connecte toutes les routes de routes/index.js au serveur avec le préfixe /api

app.use(notFound); //Si aucune route ne correspond à la requête, ce middleware signale une erreur 404 (Not Found).
app.use(errorHandler); // Gérer les autres erreurs de l'application

export default app;