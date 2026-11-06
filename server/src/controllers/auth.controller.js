import * as authService from "../services/auth.service.js";

export async function register(req, res) {
  const user = await authService.registerUser(req.valid.body);
  res.status(201).json({ success: true, data: { user } });
}