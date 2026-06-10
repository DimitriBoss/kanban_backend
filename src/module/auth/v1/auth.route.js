import express from "express";
import { loginV1Controller, registerV1Controller } from "./auth.controller.js";

const router = express.Router();

router.post("/register", registerV1Controller);
router.post("/login", loginV1Controller);

export default router;
