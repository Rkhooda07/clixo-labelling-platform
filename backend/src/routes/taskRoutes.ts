import express from "express";
import { createTask } from "../controllers/taskController.js";

const router = express.Router();

// POST /api/tasks -> create a new task
router.post("/tasks", createTask);

export default router;