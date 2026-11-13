import rateLimit from "express-rate-limit";

// Durées des fenêtres de limitation
const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

// Fonction qui crée un limiteur avec une limite et un message personnalisés.
function limiter(limit, message, windowMs = FIFTEEN_MINUTES) {
  return rateLimit({
    windowMs,                  // Durée pendant laquelle les requêtes sont comptées.
    limit,                     // Nombre maximum de requêtes autorisées.
    standardHeaders: "draft-7", // Envoie les informations de limitation dans les headers HTTP.
    legacyHeaders: false,       // Désactive les anciens headers.
    handler: (req, res) => {    // Réponse envoyée lorsque la limite est dépassée.
      res.status(429).json({
        success: false,
        error: { code: "TOO_MANY_REQUESTS", message },
      });
    },
  });
} 

// Limite générale : 100 requêtes toutes les 15 minutes par IP.
export const generalLimiter = limiter(
  Number(process.env.RATE_LIMIT_GENERAL_MAX) || 100,
  "Trop de requêtes. Réessayez dans quelques minutes."
);

// Limite de connexion : 5 tentatives toutes les 15 minutes par IP.
export const loginLimiter = limiter(
  Number(process.env.RATE_LIMIT_LOGIN_MAX) || 5,
  "Trop de tentatives de connexion. Réessayez dans 15 minutes."
);

// Limite d'inscription : 20 requêtes par heure et par IP.
export const registerLimiter = limiter(
  Number(process.env.RATE_LIMIT_REGISTER_MAX) || 20,
  "Trop de créations de compte. Réessayez plus tard.",
  ONE_HOUR
);