"use strict";

import express from "express";
import UserController from "../../controllers/user.controller.js";
import { asyncHandler } from "../../utils/index.js";
import { validateData } from "../../middlewares/validate.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validateRuleCreateUser } from "../../validate/user.validate.js";
const router = express.Router();

router.get("/", asyncHandler(UserController.findAll));

router.post(
  "/",
  validateRuleCreateUser,
  validateData,
  asyncHandler(UserController.create)
);

router.patch("/:id", asyncHandler(UserController.update));

router.delete("/:id", asyncHandler(UserController.delete));

export default router;
