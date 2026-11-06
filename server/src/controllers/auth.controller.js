import * as authService from "../services/auth.service.js";

// Inscription d'un utilisateur
export async function register(req, res) {
  // Appelle le service d'inscription avec les données validées
  const user = await authService.registerUser(req.valid.body);

  res.status(201).json({ success: true, data: { user } });
}

// Connexion d'un utilisateur
export async function login(req, res) {
  // Vérifie les identifiants et récupère le JWT
  const { user, token } = await authService.loginUser(req.valid.body);

  res.status(200).json({ success: true, data: { token, user } });
}

// Récupération de l'utilisateur connecté
export function me(req, res) {
  res.status(200).json({ success: true, data: { user: req.user } });
}