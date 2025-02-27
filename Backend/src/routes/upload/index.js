"use strict";

import express from "express";
import UploadController from "../../controllers/upload.controller.js";
import { asyncHandler } from "../../utils/index.js";
import upload from "../../configs/multer.config.js";

const router = express.Router();

router.post(
  "/file",
  upload.single("fileUpload"),
  asyncHandler(UploadController.uploadFile)
);

export default router;
