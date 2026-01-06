import express from "express";
import { 
  createSubmission, 
  getSubmissionsByTask, 
  getSubmissionsByWorker,
} from "../controllers/submissionController.ts";

const router = express.Router();

router.post("/", createSubmission);
router.get("/task/:taskId", getSubmissionsByTask);
router.get("/worker/:workerId", getSubmissionsByWorker);

export default router;