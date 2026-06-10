import express from "express";
import authRoute from "../module/auth/v1/auth.route.js";
import boardRoute from "../module/board/v1/board.route.js";
import columnRoute from "../module/column/v1/column.route.js";
import taskRoute from "../module/task/v1/task.route.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/boards", boardRoute);
router.use("/boards/:boardId", columnRoute);
router.use("/boards/:boardId", taskRoute);

export default router;
