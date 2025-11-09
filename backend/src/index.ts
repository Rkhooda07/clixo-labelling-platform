import express from "express";
import dotenv from "dotenv";
import uploadRouter from "./routes/upload.js";  // Coz we're using "type: module"
import taskRouter from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON (optional, but useful for other routes)
app.use(express.json());

// Route for file uploads
app.use("/upload", uploadRouter);

// Route for task creation
app.use("/task", taskRouter);

// Basic root route
app.get("/", (req, res) => {
  res.send("✅ Clixo backend is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
