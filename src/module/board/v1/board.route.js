import express from "express";
import {
  createBoardV1Controller,
  deleteBoardV1Controller,
  getAllBoardsV1Controller,
  getBoardByIdV1Controller,
  updateBoardV1Controller,
} from "./board.controller.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createBoardV1Controller);
router.get("/", authMiddleware, getAllBoardsV1Controller);
router.get("/:boardId", authMiddleware, getBoardByIdV1Controller);
router.delete("/:boardId", authMiddleware, deleteBoardV1Controller);
router.patch("/:boardId", authMiddleware, updateBoardV1Controller);

export default router;
