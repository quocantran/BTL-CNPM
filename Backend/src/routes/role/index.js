"use strict";

import express from "express";

import RoleController from "../../controllers/role.controller.js";

import { asyncHandler } from "../../utils/index.js";
import { validateRuleCreateRole } from "../../validate/role.validate.js";
import { validateData } from "../../middlewares/validate.middleware.js";

const router = express.Router();

router.post(
  "/",
  validateRuleCreateRole,
  validateData,
  asyncHandler(RoleController.createRole)
);
router.get("/", asyncHandler(RoleController.findAll));
router.patch("/:id", asyncHandler(RoleController.updateRole));
router.get("/:id", asyncHandler(RoleController.getRoleById));
router.delete("/:id", asyncHandler(RoleController.deleteRole));

export default router;
