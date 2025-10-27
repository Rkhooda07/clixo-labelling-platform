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
