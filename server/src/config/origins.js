const defaults = process.env.NODE_ENV === "production" ? "" : "http://localhost:5173";

export const allowedOrigins = (process.env.CORS_ORIGINS ?? defaults)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
  //On lit les origines autorisées dans .env, séparées par des virgules
  //si rien n’est défini, autorise le frontend Vite (http://localhost:5173).