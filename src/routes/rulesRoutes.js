import express from "express";
import {
  getAllRules,
  getRuleById,
  createRule,
  updateRule,
  deleteRule,
} from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const rules = await getAllRules();
  res.json(rules);
});

router.get("/:id", async (req, res) => {
  const ruleId = parseInt(req.params.id);
  const rule = await getRuleById(ruleId);
  if (rule) {
    res.json(rule);
  } else {
    res.status(404).json({ error: "Rule not found" });
  }
});

router.post("/", async (req, res) => {
  const newRule = req.body;
  const rule = await createRule(newRule);
  res.json(rule);
});

router.put("/:id", async (req, res) => {
  const ruleId = parseInt(req.params.id);
  const updatedRule = req.body;
  const rule = await updateRule(ruleId, updatedRule);
  if (rule) {
    res.json(rule);
  } else {
    res.status(404).json({ error: "Rule not found" });
  }
});

router.delete("/:id", async (req, res) => {
  const ruleId = parseInt(req.params.id);
  const success = await deleteRule(ruleId);
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Rule not found" });
  }
});

export default router;
