export function checkEnv() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32 || /replace_with|your_|change/i.test(secret)) {
    throw new Error("JWT_SECRET est manquant ou trop faible (32 caractères minimum, aléatoire).");
  }
}