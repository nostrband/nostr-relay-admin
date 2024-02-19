import express from "express";
import bodyParser from "body-parser";
import {
  getAllRules,
  getRuleById,
  createRule,
  updateRule,
  deleteRule,
  getRelays,
  updateRelays,
  createTask,
  updateTaskStatus,
  getTasksByEventIds,
} from "./db.js";
import { verifyAuthNostr } from "./auth.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(async (req, res, next) => {
  const isAuthorized = await verifyAuthNostr(req, process.env.NPUB);
  if (!isAuthorized) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

app.get("/rules", async (req, res) => {
  const rules = await getAllRules();
  res.json(rules);
});

app.get("/rules/:id", async (req, res) => {
  const ruleId = parseInt(req.params.id);
  const rule = await getRuleById(ruleId);
  if (rule) {
    res.json(rule);
  } else {
    res.status(404).json({ error: "Rule not found" });
  }
});

app.post("/rules", async (req, res) => {
  const newRule = req.body;
  const rule = await createRule(newRule);
  res.json(rule);
});

app.put("/rules/:id", async (req, res) => {
  const ruleId = parseInt(req.params.id);
  const updatedRule = req.body;
  const rule = await updateRule(ruleId, updatedRule);
  if (rule) {
    res.json(rule);
  } else {
    res.status(404).json({ error: "Rule not found" });
  }
});

app.delete("/rules/:id", async (req, res) => {
  const ruleId = parseInt(req.params.id);
  const success = await deleteRule(ruleId);
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Rule not found" });
  }
});

app.get("/relays", async (req, res) => {
  const relays = await getRelays();
  res.json(relays);
});

app.put("/relays", async (req, res) => {
  const { relay_array } = req.body;
  const updatedRelays = await updateRelays(relay_array);
  res.json(updatedRelays);
});

app.post("/tasks", async (req, res) => {
  const { eventId, status } = req.body;
  const task = await createTask(eventId, status);
  res.json(task);
});

app.get("/tasks", async (req, res) => {
  const { eventIds } = req.body;
  const tasks = await getTasksByEventIds(eventIds);
  res.json(tasks);
});

app.put("/tasks/:eventId", async (req, res) => {
  const eventId = req.params.eventId;
  const { status } = req.body;
  const updatedTask = await updateTaskStatus(eventId, status);
  res.json(updatedTask);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
