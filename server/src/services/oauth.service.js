import { AppError } from "../utils/AppError.js";

const TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo";
const invalidToken = () => new AppError(401, "INVALID_TOKEN", "Jeton invalide ou expiré.");

export async function verifyGoogleAccessToken(accessToken) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw invalidToken();

  let response;
  try {
    response = await fetch(`${TOKENINFO_URL}?access_token=${encodeURIComponent(accessToken)}`, {
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    throw new AppError(503, "AUTH_PROVIDER_UNAVAILABLE", "Service d'authentification indisponible.");
  }
  if (!response.ok) throw invalidToken();

  const info = await response.json();
  if (info.aud !== clientId || String(info.email_verified) !== "true" || !info.email) {
    throw invalidToken();
  }

  return { id: `google:${info.sub}`, email: info.email, role: "user", provider: "google" };
}
