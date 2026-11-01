import express from "express";

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, data: { status: "ok" } });
});

export default app;