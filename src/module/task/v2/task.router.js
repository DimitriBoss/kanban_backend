import express from "express";
import {
  createTaskV2Controller,
  deleteTaskV2Controller,
  getTasksByColumnIdV2Controller,
  updateTaskV2Controller,
} from "./task.controller.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.post("/:columnId", authMiddleware, createTaskV2Controller);
router.get("/:columnId", authMiddleware, getTasksByColumnIdV2Controller);
router.delete("/:columnId/:taskId", authMiddleware, deleteTaskV2Controller);
router.patch("/:columnId/:taskId", authMiddleware, updateTaskV2Controller);

export default router;
