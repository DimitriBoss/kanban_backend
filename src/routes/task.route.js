import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createTask,
  getTasksByColumn,
  moveTask,
  deleteTask,
  updateTask,
} from "../controllers/task.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/columns/:columnId/tasks", authMiddleware, createTask);
router.get("/columns/:columnId/tasks", authMiddleware, getTasksByColumn);
router.patch("/tasks/:taskId/move", authMiddleware, moveTask);
router.patch("/tasks/:taskId", authMiddleware, updateTask);
router.delete("/tasks/:taskId", authMiddleware, deleteTask);

export default router;
