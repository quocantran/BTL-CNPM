"use strict";
import express from "express";
import authRouter from "./auth/index.js";
import userRouter from "./user/index.js";
import uploadRouter from "./upload/index.js";
import roleRouter from "./role/index.js";
import permissionRouter from "./permission/index.js";
import { checkPermission } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use("/api/v1/auths", authRouter);
router.use("/api/v1/uploads", uploadRouter);

router.use(checkPermission);
router.use("/api/v1/users", userRouter);
router.use("/api/v1/permissions", permissionRouter);
router.use("/api/v1/roles", roleRouter);

export default router;
