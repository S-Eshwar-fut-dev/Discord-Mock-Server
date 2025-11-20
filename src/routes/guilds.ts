import { Router } from "express";
import { GUILDS } from "../mock/data";

const router = Router();

router.get("/", (req, res) => {
  res.json(GUILDS);
});

router.post("/", (req, res) => {
  const { name, icon } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  const g = { id: `g-${Date.now()}`, name, icon: icon ?? null };
  GUILDS.push(g);
  res.status(201).json(g);
});

export default router;
