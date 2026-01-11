import express from "express";
import { aggregateTaskResults } from "../controllers/aggregationController.ts";

const router = express.Router();

router.post("/task/:taskId/aggregate", aggregateTaskResults);

export default router;