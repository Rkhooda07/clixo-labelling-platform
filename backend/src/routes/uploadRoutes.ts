import express from "express";
import { upload, uploadFileController } from "../controllers/uploadController.ts";

const router = express.Router();

// POST /api/upload
router.post("/", upload.single("file"), uploadFileController);

export default router;