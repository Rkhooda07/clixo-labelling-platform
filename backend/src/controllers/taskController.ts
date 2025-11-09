import type { Request, Response } from "express";
import prisma from "../prisma.js";
import { validateCreateTaskBody } from "../validators/taskValidators.js";

/**
 * Controller: createTask
 * Handles POST /tasks — creates a new task draft with options.
 */

export async function createTask(req: Request, res: Response) {
  try {
    // Validate the incoming request body
    const { valid, errors } = validateCreateTaskBody(req.body);

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid task data",
        errors,
      });
    }

    // Extract user_id from authenticated user (Authorization)
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found in request.",
      });
    }

    // Destructure data
    const { title, signature, amount, options } = req.body;
  }
}