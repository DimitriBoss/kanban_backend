import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createColumn,
  deleteColumn,
  getColumnByBoard,
} from "../controllers/column.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/columns", authMiddleware, createColumn);
router.get("/columns", authMiddleware, getColumnByBoard);
router.delete("/columns/:columnId", authMiddleware, deleteColumn);

export default router;
