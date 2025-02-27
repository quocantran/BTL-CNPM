"use strict";
import express from "express";
import { asyncHandler } from "../../utils/index.js";
import AuthController from "../../controllers/auth.controller.js";
import { body } from "express-validator";
import { validateData } from "../../middlewares/validate.middleware.js";
import {
  validateRuleLogin,
  validateRuleRegister,
} from "../../validate/auth.validate.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

//public route
router.post(
  "/login",
  validateRuleLogin,
  validateData,
  asyncHandler(AuthController.login)
);

router.post(
  "/register",
  validateRuleRegister,
  validateData,
  asyncHandler(AuthController.register)
);

//auth route
router.get("/refresh", asyncHandler(AuthController.refreshToken));

router.use(authMiddleware);

router.get("/account", asyncHandler(AuthController.getCurrentUser));
router.post("/logout", asyncHandler(AuthController.logout));

export default router;
