import express from "express";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import {
  createColumnV1Controller,
  deleteColumnV1Controller,
  getColumnByBoardV1Controller,
  updateColumnV1Controller,
} from "./column.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/columns", authMiddleware, createColumnV1Controller);
router.get("/columns", authMiddleware, getColumnByBoardV1Controller);
router.delete("/columns/:columnId", authMiddleware, deleteColumnV1Controller);
router.patch("/columns/:columnId", authMiddleware, updateColumnV1Controller);

export default router;
