"use strict";
import express from "express";
import authRouter from "./auth/index.js";

const router = express.Router();

router.use("/api/v1/auths", authRouter);

export default router;
