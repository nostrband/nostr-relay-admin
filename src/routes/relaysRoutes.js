import express from "express";
import { getRelays, updateRelays } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const relays = await getRelays();
  res.json(relays);
});

router.put("/", async (req, res) => {
  const { relay_array } = req.body;
  const updatedRelays = await updateRelays(relay_array);
  res.json(updatedRelays);
});

export default router;
