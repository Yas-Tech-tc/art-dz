import express from "express";

const app = express();

app.disable("x-powered-by"); //supprimer l'annonce express, c’est un premier geste de sécurité.
app.use(express.json({ limit: "10kb" })); //est un middleware qui lit le JSON envoyé par le client et le place dans req.body

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, data: { status: "ok" } });
});

export default app;