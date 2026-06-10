import express from "express";
import {
  createColumnV2Controller,
  getAllColumnsV2Controller,
  deleteColumnV2Controller,
  updateColumnV2Controller,
} from "./column.controller.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", authMiddleware, createColumnV2Controller);
router.get("/", authMiddleware, getAllColumnsV2Controller);
router.delete("/:columnId", authMiddleware, deleteColumnV2Controller);
router.patch("/:columnId", authMiddleware, updateColumnV2Controller);

export default router;
