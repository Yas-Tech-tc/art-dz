//vérifie que les variables d'environnement sont correctement configurées, notamment la sécurité du JWT_SECRET et la validité des origines autorisées par CORS.
import { allowedOrigins } from "./origins.js";

export function checkEnv() {
  // Vérifie que le secret JWT existe et qu'il est suffisamment sécurisé.
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32 || /replace_with|your_|change/i.test(secret)) {
    throw new Error("JWT_SECRET est manquant ou trop faible (32 caractères minimum, aléatoire).");
  }

  // Vérifie que chaque origine CORS possède un format valide.
  for (const origin of allowedOrigins) {
    let valid = false;
    try {
      valid = new URL(origin).origin === origin;
    } catch {
      valid = false;
    }
    if (!valid) {
      throw new Error(`CORS_ORIGINS : origine invalide "${origin}" (format https://exemple.com, sans "/" final ni "*").`);
    }
  }

  // Vérifications supplémentaires pour l'environnement de production.
  if (process.env.NODE_ENV === "production") {
    if (allowedOrigins.length === 0) {
      throw new Error("CORS_ORIGINS est obligatoire en production.");
    }
    if (allowedOrigins.some((origin) => !origin.startsWith("https://"))) {
      throw new Error("En production, toutes les origines CORS doivent être en https.");
    }
  }
}