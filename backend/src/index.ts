import express from "express";
import dotenv from "dotenv";
import uploadRouter from "./routes/upload.js";  // Coz we're using "type: module"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON (optional, but useful for other routes)
app.use(express.json());