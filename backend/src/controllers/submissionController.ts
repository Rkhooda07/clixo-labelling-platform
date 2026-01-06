import type { Request, Response } from "express";
import prisma from "../prisma.ts";

/*
  Create a new submission
  Worrked selects option for a task
*/
export const createSubmission = async (req: Request, res: Response) => {
  try {
    const { workerId, taskId, optionId, amount } = req.body;

    // Basic sanity check
    if (!workerId || !taskId || !optionId || !amount) {
      return res.status(400).json ({
        message: "Missing required fields",
      });
    }

    const submission = await prisma.submission.create({
      data: {
        worker_id: workerId,
        task_id: taskId,
        option_id: optionId,
        amount,
      },
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error("Error creating submission: ", error);
    res.status(500).json({ message: "Internal server error "});
  }
};

/*
  Get all submissions for a specific task
*/
export const getSubmissionsByTask = async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.taskId);

    const submissions = await prisma.submission.findMany({
      where: { task_id: taskId },
      include: {
        option: true,
        worker: true,
      },
    });

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching task submissions: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/*
  Get all submissions made by a worker
*/
export const getSubmissionsByWorker = async (req: Request, res: Response) => {
  try {
    const workerId = Number(req.params.workerId);

    const submissions = await prisma.submission.findMany({
      where: { worker_id: workerId },
      include: {
        task: true,
        option: true,
      },
    });

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching worker submissions: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};