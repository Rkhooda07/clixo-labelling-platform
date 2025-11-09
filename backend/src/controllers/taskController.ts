import type { Request, Response } from "express";
import prisma from "../prisma.js";
import { validateCreateTaskBody } from "../validators/taskValidators.js";

/**
 * Controller: createTask
 * Handles POST /tasks — creates a new task draft with options.
 */

export async function createTask(req: Request, res: Response) {
  
}