"use strict";

import express from "express";
import PermissionController from "../../controllers/permission.controller.js";
import { asyncHandler } from "../../utils/index.js";
import { validateRuleCreatePermission } from "../../validate/permission.validate.js";
import { validateData } from "../../middlewares/validate.middleware.js";
const router = express.Router();

router.post(
  "/",
  validateRuleCreatePermission,
  validateData,
  asyncHandler(PermissionController.createPermission)
);

router.get("/", asyncHandler(PermissionController.findAll));

router.patch("/:id", asyncHandler(PermissionController.updatePermission));

router.delete("/:id", asyncHandler(PermissionController.deletePermission));

export default router;
