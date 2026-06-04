import express from "express";
import {
  createBoardController,
  deleteBoardController,
  getAllBoardsController,
} from "../controllers/board.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createBoardController);
router.get("/", authMiddleware, getAllBoardsController);
router.delete("/:boardId", authMiddleware, deleteBoardController);

export default router;
