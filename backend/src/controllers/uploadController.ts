import type { Request, Response } from "express";
import multer from "multer";
import { PinataSDK } from "pinata";
import prisma from "../prisma.ts";
import dotenv from "dotenv";

dotenv.config();

// Multer memory storage for file uploads
export const upload = multer({ storage: multer.memoryStorage() });

const PINATA_JWT = process.env.PINATA_JWT;
if (!PINATA_JWT) {
  throw new Error("PINATA_JWT is not set in env");
}

// Pinata client
const pinata = new PinataSDK({ pinataJwt: PINATA_JWT });

// Helper to build gateway URL
function buildGatewayUrl(cid: string) {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}

// ----------------------
// UPLOAD CONTROLLER
// ----------------------
export async function uploadFileController(req: Request, res: Response) {
  try {
    // 1. File must exist
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded under field 'file'" });
    }

    // 2. Validate file
    const allowedMimes = (process.env.ALLOWED_MIMES || "image/jpeg,image/png,image/webp").split(",");
    const maxMB = Number(process.env.MAX_UPLOAD_MB || 5);

    if (!allowedMimes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: `Disallowed mime type: ${req.file.mimetype}` });
    }
    if (req.file.size > maxMB * 1024 * 1024) {
      return res.status(400).json({ error: `File too large. Max ${maxMB} MB` });
    }

    // 3. Extract fields
    const originalName = req.file.originalname || `upload-${Date.now()}.bin`;
    const taskIdRaw = req.body.task_id ?? req.body.taskId;
    const optionIdRaw = req.body.option_id ?? req.body.optionId ?? null;

    const taskId = taskIdRaw ? Number(taskIdRaw) : null;
    const optionId = optionIdRaw ? Number(optionIdRaw) : null;

    if (!taskId) {
      return res.status(400).json({ error: "Missing required form field 'task_id'" });
    }

    // 4. Convert buffer to File object (required by Pinata SDK)
    const fileToUpload = new File([req.file.buffer], originalName, {
      type: req.file.mimetype,
      lastModified: Date.now(),
    });

    // 5. Upload to Pinata
    const result = await pinata.upload.public.file(fileToUpload, {
      metadata: { name: originalName },
    });

    const cid = result.cid;
    const ipfsUri = `ipfs://${cid}`;
    const gatewayUrl = buildGatewayUrl(cid);

    // 6. Save or update Option in database
    let optionRecord;

    if (optionId) {
      optionRecord = await prisma.option.update({
        where: { id: optionId },
        data: {
          ipfs_cid: cid,
          ipfs_uri: ipfsUri,
          gateway_url: gatewayUrl,
          image_url: req.body.image_url || null,
        },
      });
    } else {
      optionRecord = await prisma.option.create({
        data: {
          ipfs_cid: cid,
          ipfs_uri: ipfsUri,
          gateway_url: gatewayUrl,
          image_url: req.body.image_url || null,
          option_id: optionId,
          task: { connect: { id: taskId } },
        },
      });
    }

    // 7. Response
    return res.status(200).json({
      ok: true,
      cid,
      ipfs_uri: ipfsUri,
      gatewayUrl,
      file_name: originalName,
      option: optionRecord,
    });
  } catch (err: any) {
    console.error("Upload Error: ", err);
    return res.status(500).json({ error: err.message || "Upload failed" });
  }
}