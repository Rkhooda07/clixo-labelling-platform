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

    // Create task and related options in a single txn
    const task = await prisma.task.create({
      data: {
        title,
        signature: signature || null,
        amount: amount || null,
        user_id: userId,
        option: {
          create: options.map((opt: any) => ({
            ipfs_cid: opt.ipfs_cid,
            ipfs_uri: opt.ipfs_uri || null,
            gateway_url: opt.gateway_url,
            image_url: opt.image_url || null,
            option_id: opt.optionId || null,
          })),
        },
      },
      include: { option: true },
    });

    return res.status(201).json({
      success: true,
      message: "Task draft created successfully.",
      task,
    });
  } catch (error) {
    console.error("Error creating task: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while creating task.",
    });
  }
}