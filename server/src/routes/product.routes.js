import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { idParam, listProductsQuery,createProductSchema,
  updateProductSchema,} from "../validators/product.validators.js";
import * as productController from "../controllers/product.controller.js";
import { authenticate, requireAdmin } from "../middlewares/auth.js";

// Créer un nouveau routeur Express
const router = Router();

// Route GET "/" : récupérer la liste des produits
// Valider d'abord les paramètres de recherche, puis appeler le contrôleur list
router.get("/", validate(listProductsQuery, "query"), productController.list);

// Route GET "/:id" : récupérer un produit par son ID
// Valider d'abord l'ID reçu dans l'URL, puis appeler le contrôleur getOne
router.get("/:id", validate(idParam, "params"), productController.getOne);

router.post("/", authenticate, requireAdmin, validate(createProductSchema), productController.create); // Inscription d'un nouvel utilisateur après validation des données.

router.put("/:id", authenticate, requireAdmin, validate(idParam, "params"), validate(updateProductSchema), productController.update);
 // Connexion d'un utilisateur après validation de ses identifiants.

router.delete("/:id", authenticate, requireAdmin, validate(idParam, "params"), productController.remove); // Récupération des informations de l'utilisateur connecté après vérification du JWT.

// Exporter le routeur pour l'utiliser dans l'application Express
export default router;
