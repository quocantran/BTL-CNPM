"use strict";
import express from "express";
import { asyncHandler } from "../../utils/index.js";
import AuthController from "../../controllers/auth.controller.js";

const router = express.Router();

router.get("/login", asyncHandler(AuthController.login));

export default router;
