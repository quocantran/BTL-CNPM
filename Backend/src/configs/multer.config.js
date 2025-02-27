"use strict";

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "./cloudinary.config.js";
import { fileValidation } from "../validate/upload.validate.js";
import { BadRequestException } from "../core/error.response.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    format: async (req, file) => {
      try {
        return fileValidation(file);
      } catch (err) {
        throw new BadRequestException("File type is not supported");
      }
    }, // Định dạng file
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

const upload = multer({ storage: storage });

export default upload;
