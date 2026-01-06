import express from "express";
import dotenv from "dotenv";
import uploadRouter from "./routes/uploadRoutes.ts";  // Coz we're using "type: module"
import taskRouter from "./routes/taskRoutes.ts";
import submissionRoutes from "./routes/submissionRoutes.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON (optional, but useful for other routes)
app.use(express.json());

// Route for file uploads
app.use("/api/upload", uploadRouter);

// Route for task creation
app.use("/api/tasks", taskRouter);

// Route for submissions
app.use("/api/submissions", submissionRoutes);

// Basic root route
app.get("/", (req, res) => {
  res.send("✅ Clixo backend is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
