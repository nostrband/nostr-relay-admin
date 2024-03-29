import express from "express";
import {
  createTask,
  getTasksByEventIds,
  updateTaskStatus,
  deleteTaskByEventId,
} from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { eventId, status } = req.body;
  const task = await createTask(eventId, status);
  res.json(task);
});

router.get("/", async (req, res) => {
  const eventIds = Object.values(req.query);
  const tasks = await getTasksByEventIds(eventIds);
  res.json(tasks);
});

router.put("/:eventId", async (req, res) => {
  const eventId = req.params.eventId;
  const { status } = req.body;
  const updatedTask = await updateTaskStatus(eventId, status);
  res.json(updatedTask);
});

router.delete("/:eventId", async (req, res) => {
  const eventId = req.params.eventId;
  const success = await deleteTaskByEventId(eventId);
  if (success) {
    res.json({ success: true, message: "Task deleted successfully" });
  } else {
    res.status(404).json({ success: false, message: "Task not found" });
  }
});

export default router;
