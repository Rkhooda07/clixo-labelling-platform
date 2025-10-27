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
