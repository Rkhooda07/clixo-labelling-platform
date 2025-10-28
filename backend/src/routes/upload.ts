import express from "express";
import multer from "multer";
import { PinataSDK } from "pinata";
import prisma from "../prisma.js";
import dotenv from "dotenv";
import PinataClient from "pinata";

dotenv.config();

// Router setup (to mount this module in index.ts (main server))
const router = express.Router();

// multer memory storage -> Stores uploaded files in RAM as buffer
const upload = multer({ storage: multer.memoryStorage() });

const PINATA_JWT = process.env.PINATA_JWT;
if (!PINATA_JWT) {
  throw new Error("PINATA_JWT is not set in the environment variable");
}

// Creating Pinata SDK client using JWT token (server-side secret)
const pinata = new PinataSDK( {pinataJwt: PINATA_JWT} );

// Helper: build a gateway URL for easy browser access (Pinata gateway)
// We encode filename to preserce safe characters

function buildGatewayUrl(cid: string, filename?: string) {
  return `https://gateway.pinata.cloud/ipfs/${cid}${filename ? "/" + encodeURIComponent(filename) : ""}`;
}

/**
 * Upload endpoint:
 * - Accepts multipart file named "file"
 * - Accepts form fields: task_id (Int) and option_id (Int, optional)
 *
 * Behavior:
 * - Validate file (mime, size)
 * - Upload to Pinata (pinFileToIPFS)
 * - Create an Option record in DB with ipfs_cid/ipfs_uri/gateway_url (and fallback image_url if provided)
*/

router.post("/", upload.single("file"), async (req, res) => {
  try {
    // Ensuring file exists
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded under field 'file'" });
    }

    // Basic validation - mime and max size
    const allowedMimes = (process.env.ALLOWED_MIMES || "image/jpeg,image/png,image/webp").split(",");
    const maxMB = Number(process.env.MAX_UPLOAD_MB || 5);
    if (!allowedMimes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: `Disallowed mime type: ${req.file.mimetype}` });
    }
    if (req.file.size > maxMB * 1024 * 1024) {
      return res.status(400).json({ error: `File too large. Max ${maxMB} MB` });
    }

    // Get filename, task_id, option_id from request
    const originalName = req.file.originalname || `upload-${Date.now()}.bin`;
    const taskIdRaw = req.body.task_id ?? req.body.taskId;   // accept multiple naming styles
    const optionIdRaw = req.body.option_id ?? req.body.optionId ?? null;

    // parse integers safely
    const taskId = taskIdRaw ? Number(taskIdRaw) : null;
    const optionId = optionIdRaw ? Number(optionIdRaw) : null;
    if (!taskId) {
      return res.status(400).json({ error: "Missing required form field 'task_id' (id of Task)" });
    }
  }
}