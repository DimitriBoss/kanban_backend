import express from "express";
import cors from "cors";
import routesV1 from "./routes/routes.v1.js";
import routesV2 from "./routes/routes.v2.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["https://kanban-two-eta.vercel.app"],
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Hello from kanban");
});

app.use("/api/v1", routesV1);
app.use("/api/v2", routesV2);

export default app;
