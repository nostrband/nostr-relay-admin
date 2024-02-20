import express from "express";
import { createTask, getTasksByEventIds, updateTaskStatus } from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { eventId, status } = req.body;
  const task = await createTask(eventId, status);
  res.json(task);
});

router.get("/", async (req, res) => {
  const { eventIds } = req.body;
  const tasks = await getTasksByEventIds(eventIds);
  res.json(tasks);
});

router.put("/:eventId", async (req, res) => {
  const eventId = req.params.eventId;
  const { status } = req.body;
  const updatedTask = await updateTaskStatus(eventId, status);
  res.json(updatedTask);
});

export default router;
