import express from "express";
import {
  createBoardController,
  deleteBoardController,
  getAllBoardsController,
  getBoardByIdController,
} from "../controllers/board.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createBoardController);
router.get("/", authMiddleware, getAllBoardsController);
router.get("/:boardId", authMiddleware, getBoardByIdController);
router.delete("/:boardId", authMiddleware, deleteBoardController);

export default router;
