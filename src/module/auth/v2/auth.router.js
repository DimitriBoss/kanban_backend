import express from "express";
import { loginV2Controller, registerV2Controller } from "./auth.controller.js";

const router = express.Router();

router.post("/register", registerV2Controller);
router.post("/login", loginV2Controller);

export default router;
