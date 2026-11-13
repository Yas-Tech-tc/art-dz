import mongoose from "mongoose";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { verifyToken } from "../services/token.service.js";
import { verifyGoogleAccessToken } from "../services/oauth.service.js";

const invalidToken = () => new AppError(401, "INVALID_TOKEN", "Jeton invalide ou expiré.");

async function userFromLocalJwt(token) {
  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw invalidToken();
  }

  const user = mongoose.isValidObjectId(payload.sub)
    ? await User.findById(payload.sub)
    : null;
  if (!user) throw invalidToken();
  return user;
}

export async function authenticate(req, res, next) {
  const match = /^Bearer\s+(\S+)$/i.exec(req.get("authorization") ?? "");
  if (!match) {
    throw new AppError(401, "AUTH_REQUIRED", "Authentification requise.");
  }

  const token = match[1];
  req.user = token.startsWith("eyJ")
    ? await userFromLocalJwt(token)
    : await verifyGoogleAccessToken(token);
  next();
}

export function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    throw new AppError(403, "FORBIDDEN", "Vous n'avez pas les droits nécessaires.");
  }
  next();
}