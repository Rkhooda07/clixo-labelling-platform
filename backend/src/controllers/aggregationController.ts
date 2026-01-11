import type { Request, Response } from "express";
import prisma from "../prisma.ts";

/*
  Aggregating submissions ->
    - Count votes/option
    - Determine winning option
    - Lock the test
*/
export const aggregateTaskResults = async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.taskId);

    if (!taskId) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    // Check task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        options: true,
        submissions: true,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Prevent Re-aggregation
    if (task.status === "COMPLETED") {
      return res.status(400).json({
        message: "Task already completed",
      });
    }

    // Count submissions per option
    const counts: Record<number, number> = {};

    for (const submimssion of task.submissions) {
      counts[submimssion.option_id] =
        (counts[submimssion.option_id] || 0) + 1;
    }

    // Determine winning option
    let winningOptionId:  number | null = null;
    let maxVotes = 0;

    for (const [optionId, voteCount] of Object.entries(counts)) {
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        winningOptionId = Number(optionId);
      }
    }

    // Lock the task
    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: "COMPLETED",
      },
    });

    res.json({
      taskId,
      winningOptionId,
      votes: counts,
      totalSubmissions: task.submissions.length,
    });
  } catch (error) {
    console.error("Aggregation error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};