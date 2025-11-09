import express from "express";
import { createTask } from "../controllers/taskController.ts";

const router = express.Router();

// POST /api/tasks -> create a new task
router.post("/", createTask);

export default router;