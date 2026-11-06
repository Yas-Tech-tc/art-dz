import mongoose from "mongoose";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { verifyToken } from "../services/token.service.js";

// Middleware qui vérifie l'authentification de l'utilisateur
export async function authenticate(req, res, next) {
  // Récupère le header Authorization
  const header = req.get("authorization") ?? "";

  // Vérifie le format Bearer du token
  const match = /^Bearer\s+(\S+)$/i.exec(header);
  if (!match) {
    throw new AppError(401, "AUTH_REQUIRED", "Authentification requise.");
  }

  let payload;
  try {
    // Vérifie le JWT et récupère son contenu
    payload = verifyToken(match[1]);
  } catch {
    throw new AppError(401, "INVALID_TOKEN", "Jeton invalide ou expiré.");
  }

  // Vérifie l'identifiant du token et recherche l'utilisateur dans MongoDB
  const user = mongoose.isValidObjectId(payload.sub)
    ? await User.findById(payload.sub)
    : null;

  if (!user) {
    throw new AppError(401, "INVALID_TOKEN", "Jeton invalide ou expiré.");
  }

  // Ajoute l'utilisateur authentifié à la requête
  req.user = user;

  // Passe au middleware ou controller suivant
  next();
}

export function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    throw new AppError(403, "FORBIDDEN", "Vous n'avez pas les droits nécessaires.");
  }
  next();
}