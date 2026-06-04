import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import boardRoute from "./routes/board.route.js";
import columnRoute from "./routes/column.route.js";
import taskRoute from "./routes/task.route.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from kanban");
});

app.use("/auth", authRoute);
app.use("/boards", boardRoute);
app.use("/boards/:boardId", columnRoute);
app.use("/boards/:boardId", taskRoute);

export default app;
