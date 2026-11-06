import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.js";
import { registerSchema, loginSchema } from "../validators/auth.validators.js";
import * as authController from "../controllers/auth.controller.js";
import { loginLimiter, registerLimiter } from "../middlewares/rateLimiters.js";

const router = Router();

// Route d'inscription : valide les données puis appelle le controller
router.post("/register", registerLimiter, validate(registerSchema), authController.register);

// Route de connexion : valide les identifiants puis appelle le controller
router.post("/login", loginLimiter, validate(loginSchema), authController.login);

// Route protégée : vérifie le JWT avant de récupérer les informations de l'utilisateur
router.get("/me", authenticate, authController.me);

// Exporte le routeur pour l'utiliser dans l'application principale
export default router;