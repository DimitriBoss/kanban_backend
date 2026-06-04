import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createTask,
  getTasksByColumn,
  moveTask,
} from "../controllers/task.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/columns/:columnId/tasks", authMiddleware, createTask);
router.get("/columns/:columnId/tasks", authMiddleware, getTasksByColumn);
router.patch("/tasks/:taskId/move", authMiddleware, moveTask);

export default router;
