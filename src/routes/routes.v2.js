import express from "express";
import authRouteV2 from "../module/auth/v2/auth.router.js";
import boardRouteV2 from "../module/board/v2/board.router.js";
import columnRouteV2 from "../module/column/v2/column.route.js";
import taskRouteV2 from "../module/task/v2/task.router.js";

const router = express.Router();

router.use("/auth", authRouteV2);
router.use("/boards", boardRouteV2);
router.use("/boards/:boardId", columnRouteV2);
router.use("/boards/:boardId", taskRouteV2);

export default router;
