"use strict";
import express from "express";
import { asyncHandler } from "../../utils/index.js";
import authController from "../../controllers/auth.controller.js";

const router = express.Router();

router.get("/login", asyncHandler(authController.login));

export default router;
