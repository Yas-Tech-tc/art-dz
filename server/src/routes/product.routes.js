import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { idParam, listProductsQuery } from "../validators/product.validators.js";
import * as productController from "../controllers/product.controller.js";

// Créer un nouveau routeur Express
const router = Router();

// Route GET "/" : récupérer la liste des produits
// Valider d'abord les paramètres de recherche, puis appeler le contrôleur list
router.get("/", validate(listProductsQuery, "query"), productController.list);

// Route GET "/:id" : récupérer un produit par son ID
// Valider d'abord l'ID reçu dans l'URL, puis appeler le contrôleur getOne
router.get("/:id", validate(idParam, "params"), productController.getOne);

// Exporter le routeur pour l'utiliser dans l'application Express
export default router;
