import { Router } from "express";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";

// Créer le routeur principal de l'API
const router = Router();

// Créer une route pour vérifier que le serveur fonctionne
router.get("/health", (req, res) => {

  // Retourner une réponse 200 avec le statut du serveur
  res.status(200).json({ success: true, data: { status: "ok" } });
});
//Monter toutes les routes d'authentification sous le préfixe "/auth"
router.use("/auth", authRoutes); 

// Regrouper toutes les routes des produits sous le préfixe /products
router.use("/products", productRoutes);

// Exporter le routeur pour l'utiliser dans app.js
export default router;
