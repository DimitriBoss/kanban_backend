import express from "express";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import {
  createTaskV1Controller,
  getTasksByColumnV1Controller,
  moveTaskV1Controller,
  deleteTaskV1Controller,
  updateTaskV1Controller,
} from "./task.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/columns/:columnId/tasks", authMiddleware, createTaskV1Controller);
router.get("/columns/:columnId/tasks", authMiddleware, getTasksByColumnV1Controller);
router.patch("/tasks/:taskId/move", authMiddleware, moveTaskV1Controller);
router.patch("/tasks/:taskId", authMiddleware, updateTaskV1Controller);
router.delete("/tasks/:taskId", authMiddleware, deleteTaskV1Controller);

export default router;
