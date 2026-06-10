import express from "express";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import {
  createBoardV2Controller,
  getAllBoardsV2Controller,
  deleteBoardV2Controller,
  updateBoardV2Controller,
} from "./board.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createBoardV2Controller);
router.get("/", authMiddleware, getAllBoardsV2Controller);
router.delete("/:boardId", authMiddleware, deleteBoardV2Controller);
router.patch("/:boardId", authMiddleware, updateBoardV2Controller);

export default router;
